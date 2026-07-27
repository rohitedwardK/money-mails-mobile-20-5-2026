import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {baseUrl} from '../../../connections';
import getColors from '../../../utils/colors';

const EMPTY_ARRAY = [];
const USER_FILE_BASE_URL = baseUrl.replace(/\/api\/v1\/?$/, '');

const ensureString = value => {
  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return '';
  }

  return String(value);
};

const ensureLineArray = value => {
  if (Array.isArray(value)) {
    return value.map(item => ensureString(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return EMPTY_ARRAY;
};

const ensureImageArray = value => {
  if (!Array.isArray(value)) {
    return EMPTY_ARRAY;
  }

  return value
    .map(item => ensureString(item).trim())
    .filter(Boolean)
    .slice(0, 3);
};

const ensureImageValue = value => ensureString(value).trim();

const resolveAssetUrl = value => {
  const asset = ensureString(value).trim();

  if (!asset) {
    return '';
  }

  if (/^https?:\/\//i.test(asset) || asset.startsWith('data:')) {
    return asset;
  }

  return `${USER_FILE_BASE_URL}/user/file/${asset}`;
};

const resolveDoYouKnowProfile = payload => {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data[0] ?? null;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items[0] ?? null;
  }

  if (Array.isArray(payload)) {
    return payload[0] ?? null;
  }

  if (payload?.data && typeof payload.data === 'object') {
    return payload.data;
  }

  return payload;
};

const extractProfilePreview = payload => {
  const profile = resolveDoYouKnowProfile(payload);
  const raw =
    profile?.do_you_know ||
    profile?.do_you_know_profile ||
    profile?.store_profile_metadata ||
    profile?.profile_metadata ||
    profile ||
    {};

  return {
    profileImage: ensureImageValue(raw.profileImage),
    galleryImages: ensureImageArray(raw.galleryImages),
    bannerImage: ensureImageValue(raw.bannerImage),
    founderName: ensureString(
      raw.founder_name || raw.founderName || raw.founder?.name || raw.name,
    ),
    role: ensureString(raw.role || raw.designation),
    brandName: ensureString(raw.brand_name || raw.brandName || raw.store_name),
    tagline: ensureString(raw.tagline),
    basedIn: ensureString(raw.based_in || raw.basedIn),
    industry: ensureString(raw.industry),
    experience: ensureString(
      raw.experience || raw.yearsOfExperience || raw.experience_years,
    ),
    activeLocations: ensureString(
      raw.active_locations || raw.activeLocations || raw.location_count,
    ),
    passionSkill: ensureString(raw.passion_skill || raw.passionSkill),
    whyBusiness: ensureString(raw.why_business || raw.whyBusiness),
    currentLocations: ensureString(
      raw.current_locations || raw.currentLocations,
    ),
    growthVision: ensureString(raw.growth_vision || raw.growthVision),
    about: ensureString(raw.about),
    journey: ensureString(raw.journey),
    ventures: ensureLineArray(raw.ventures),
    achievements: ensureLineArray(raw.achievements),
    differentiators: ensureLineArray(
      raw.differentiators || raw.what_sets_apart || raw.whatSetsApart,
    ),
    philosophy: ensureString(raw.philosophy),
    impact: ensureString(raw.impact),
    timeline: ensureLineArray(raw.timeline),
    personalHighlights: ensureLineArray(
      raw.personal_highlights || raw.personalHighlights,
    ),
  };
};

const hasPreviewContent = profile =>
  Boolean(
    profile?.profileImage ||
      profile?.bannerImage ||
      profile?.galleryImages?.length ||
      profile?.founderName ||
      profile?.brandName ||
      profile?.tagline ||
      profile?.basedIn ||
      profile?.industry ||
      profile?.experience ||
      profile?.activeLocations ||
      profile?.passionSkill ||
      profile?.whyBusiness ||
      profile?.currentLocations ||
      profile?.growthVision ||
      profile?.about ||
      profile?.journey ||
      profile?.ventures?.length ||
      profile?.achievements?.length ||
      profile?.differentiators?.length ||
      profile?.philosophy ||
      profile?.impact ||
      profile?.timeline?.length ||
      profile?.personalHighlights?.length,
  );

const StatusCard = ({heading, description, isLoading}) => {
  const {themeColors: colors} = getColors();

  return (
    <View style={styles.statusCard}>
      <View style={[styles.statusIcon, {backgroundColor: colors.brandSoft}]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.highlightPrimary} />
        ) : (
          <Text style={[styles.statusIconText, {color: colors.highlightPrimary}]}>?</Text>
        )}
      </View>
      <Text style={[styles.statusHeading, {color: colors.fontPrimary}]}>
        {heading}
      </Text>
      <Text style={[styles.statusDescription, {color: colors.fontMuted}]}>
        {description}
      </Text>
    </View>
  );
};

const DetailBlock = ({title, value}) => {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <Text style={styles.blockText}>{value}</Text>
    </View>
  );
};

const DetailList = ({title, items}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={`${title}-${index}`} style={styles.listRow}>
          <View style={styles.listBullet} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const InfoCard = ({label, value}) => {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const DoYouKnowSection = ({
  title = 'Do you Know',
  data,
  fallbackStore,
  hasSelectedBrand,
  hasData,
  isLoading,
  errorMessage,
}) => {
  const {themeColors: colors} = getColors();
  const profile = extractProfilePreview(data);
  const hasContent = hasData && hasPreviewContent(profile);

  let heading = `${title} content coming soon`;
  let description = 'There is no mapped content available for this section yet.';

  if (!hasSelectedBrand) {
    heading = `Select a brand to load ${title}`;
    description =
      'Pick a store from the brand list first, then open this tab to view related content.';
  } else if (isLoading) {
    heading = `Loading ${title}`;
    description = 'We are fetching the latest brand-specific content.';
  } else if (errorMessage) {
    heading = `Unable to load ${title}`;
    description =
      'The request did not complete successfully. Try another brand or check the endpoint.';
  }

  if (!hasContent) {
    return (
      <StatusCard
        heading={heading}
        description={description}
        isLoading={isLoading}
      />
    );
  }

  const bannerUri = resolveAssetUrl(profile.bannerImage);
  const profileUri =
    resolveAssetUrl(profile.profileImage) || fallbackStore?.logo_url || '';
  const displayName =
    profile.founderName || profile.brandName || fallbackStore?.company_name || 'Founder Profile';
  const subtitle = [profile.role, profile.brandName].filter(Boolean).join(' | ');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        {(bannerUri || profileUri) && (
          <View style={styles.mediaWrap}>
            {bannerUri ? (
              <Image source={{uri: bannerUri}} style={styles.bannerImage} />
            ) : (
              <View style={[styles.bannerFallback, {backgroundColor: colors.brandSoft}]} />
            )}
            {!!profileUri && (
              <Image source={{uri: profileUri}} style={styles.profileImage} />
            )}
          </View>
        )}

        <View style={[styles.identityPanel, {backgroundColor: colors.brandSoft}]}>
          <Text style={[styles.identityTitle, {color: colors.fontPrimary}]}>
            {displayName}
          </Text>
          {!!subtitle && (
            <Text style={[styles.identitySubtitle, {color: colors.fontSecondary}]}>
              {subtitle}
            </Text>
          )}
          {!!profile.tagline && (
            <Text style={[styles.tagline, {color: colors.fontSecondary}]}>
              {profile.tagline}
            </Text>
          )}
        </View>

        <View style={styles.infoGrid}>
          <InfoCard label="Based In" value={profile.basedIn} />
          <InfoCard label="Industry" value={profile.industry} />
          <InfoCard label="Experience" value={profile.experience} />
          <InfoCard label="Active Locations" value={profile.activeLocations} />
        </View>

        <DetailBlock title="Passion / Skill" value={profile.passionSkill} />
        <DetailBlock title="Why This Business" value={profile.whyBusiness} />
        <DetailBlock title="Current Locations" value={profile.currentLocations} />
        <DetailBlock title="Growth Vision" value={profile.growthVision} />
        <DetailBlock title="About" value={profile.about} />
        <DetailBlock title="Journey" value={profile.journey} />
        <DetailList title="Ventures" items={profile.ventures} />
        <DetailList title="Achievements" items={profile.achievements} />
        <DetailList title="What Sets Them Apart" items={profile.differentiators} />
        <DetailBlock title="Philosophy" value={profile.philosophy} />
        <DetailBlock title="Impact & Influence" value={profile.impact} />
        <DetailList title="Timeline" items={profile.timeline} />
        <DetailList title="Personal Highlights" items={profile.personalHighlights} />

        {profile.galleryImages.length > 0 && (
          <View style={styles.galleryGrid}>
            {profile.galleryImages.map((image, index) => (
              <Image
                key={`${image}-${index}`}
                source={{uri: resolveAssetUrl(image)}}
                style={styles.galleryImage}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  content: {
    width: '100%',
  },
  mediaWrap: {
    position: 'relative',
    marginBottom: 42,
  },
  bannerImage: {
    width: '100%',
    height: 126,
    borderRadius: 12,
    backgroundColor: '#EEF2F5',
  },
  bannerFallback: {
    width: '100%',
    height: 126,
    borderRadius: 12,
  },
  profileImage: {
    position: 'absolute',
    left: 14,
    bottom: -28,
    width: 66,
    height: 66,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  identityPanel: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
  },
  identityTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  identitySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  tagline: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 4,
  },
  infoCard: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  infoLabel: {
    color: '#6B7280',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    minHeight: 44,
    color: '#111827',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  block: {
    marginTop: 14,
  },
  blockTitle: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  blockText: {
    color: '#374151',
    fontSize: 12,
    lineHeight: 18,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listBullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#43A047',
    marginTop: 7,
    marginRight: 8,
  },
  listText: {
    flex: 1,
    color: '#374151',
    fontSize: 12,
    lineHeight: 18,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 16,
  },
  galleryImage: {
    width: '31%',
    height: 86,
    borderRadius: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#EEF2F5',
  },
  statusCard: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 28,
  },
  statusIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusIconText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
  },
  statusHeading: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DoYouKnowSection;
