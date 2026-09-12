import React from 'react';
import {act, create} from 'react-test-renderer';
import {QueryClientProvider} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import * as Keychain from 'react-native-keychain';
import {UserContext} from '../src/context/UserContext';
import {queryClient} from '../src/api/queryClient';
import {useCampaignTicketHistory} from '../src/hooks/useCampaignQueries';
import {fetchUserCampaignTickets} from '../src/api/moneyMails';
import {clearAuthSession, stripSensitiveFromUser} from '../src/utils/secureStorage';

// Native component modules initialize slowly on Windows under a concurrent Gradle build.
jest.setTimeout(30000);

jest.mock('../src/api/moneyMails', () => ({
  fetchUserCampaignTickets: jest.fn(),
}));

const TicketProbe = () => {
  const {data} = useCampaignTicketHistory();
  return React.createElement('tickets', {data: data || []});
};
const tree = uuid => (
  <QueryClientProvider client={queryClient}>
    <UserContext.Provider value={{userDetails: uuid ? {uuid, token: 'test-token'} : {}}}>
      <TicketProbe />
    </UserContext.Provider>
  </QueryClientProvider>
);
const flush = () => act(async () => {
  await new Promise(resolve => setTimeout(resolve, 20));
});

let renderer;
afterEach(async () => {
  if (renderer) {await act(async () => renderer.unmount());}
  renderer = null;
  queryClient.clear();
  jest.clearAllMocks();
});

test('switching accounts does not show the previous account tickets', async () => {
  let finishSecondAccount;
  fetchUserCampaignTickets.mockResolvedValueOnce([{uuid: 'account-a-ticket'}]);
  fetchUserCampaignTickets.mockImplementationOnce(() => new Promise(resolve => {
    finishSecondAccount = resolve;
  }));
  await act(async () => { renderer = create(tree('account-a')); });
  await flush();
  expect(JSON.stringify(renderer.toJSON())).toContain('account-a-ticket');

  await act(async () => renderer.update(tree('account-b')));
  expect(JSON.stringify(renderer.toJSON())).not.toContain('account-a-ticket');
  await act(async () => finishSecondAccount([{uuid: 'account-b-ticket'}]));
  await flush();
  expect(JSON.stringify(renderer.toJSON())).toContain('account-b-ticket');
});

test('guests do not request private ticket history', async () => {
  await act(async () => { renderer = create(tree(null)); });
  await flush();
  expect(fetchUserCampaignTickets).not.toHaveBeenCalled();
});

test('logout clears private cache, native credentials and Bingo cookies and cancels pending reads', async () => {
  queryClient.setQueryData(['private-mail'], {subject: 'private'});
  await AsyncStorage.setItem('user', JSON.stringify({uuid: 'account-a'}));
  let finishRequest;
  let requestSignal;
  const pending = queryClient.fetchQuery({
    queryKey: ['pending-private-mail'],
    queryFn: ({signal}) => {
      requestSignal = signal;
      return new Promise(resolve => { finishRequest = resolve; });
    },
  }).catch(() => undefined);
  await clearAuthSession();
  expect(requestSignal.aborted).toBe(true);
  finishRequest({subject: 'late private data'});
  await pending;
  expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  expect(await AsyncStorage.getItem('user')).toBeNull();
  expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  expect(CookieManager.clearAll).toHaveBeenCalled();
});

test('public profile storage excludes both forms of the payout identifier', () => {
  const safe = stripSensitiveFromUser({
    token: 'token', ssn: 'ssn', id_number: 'id', id_proof: 'proof',
    zelle_id: 'top-level', address: {zelle_id: 'nested', city: 'city'},
  });
  expect(safe).toEqual({address: {city: 'city'}});
});
