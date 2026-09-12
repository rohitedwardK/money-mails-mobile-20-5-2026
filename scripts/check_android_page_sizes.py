"""Check ELF LOAD alignment for every 64-bit native library in an AAB/APK.

Usage: python scripts/check_android_page_sizes.py path/to/app-release.aab
This checks native binaries, not APK ZIP alignment or on-device PDF rendering.
"""
import argparse
import struct
import sys
import zipfile


def check_bundle(path):
    checked = 0
    failures = []
    with zipfile.ZipFile(path) as bundle:
        for name in bundle.namelist():
            if not name.endswith('.so') or not any(
                f'/{abi}/' in name for abi in ('arm64-v8a', 'x86_64')
            ):
                continue
            checked += 1
            data = bundle.read(name)
            if data[:4] != b'\x7fELF' or data[4] != 2:
                failures.append(f'{name}: expected a 64-bit ELF file')
                continue
            endian = '<' if data[5] == 1 else '>'
            table = struct.unpack_from(endian + 'Q', data, 32)[0]
            size, count = struct.unpack_from(endian + 'HH', data, 54)
            for i in range(count):
                header = table + i * size
                kind, _, offset, address, _, _, _, alignment = struct.unpack_from(
                    endian + 'IIQQQQQQ', data, header
                )
                if kind == 1 and (alignment < 16384 or (address - offset) % 16384):
                    failures.append(f'{name}: LOAD alignment {alignment}, offset {offset}, address {address}')
    if not checked:
        failures.append('No 64-bit native libraries were found.')
    for failure in failures:
        print('FAIL:', failure)
    print(f'Checked {checked} native libraries; {len(failures)} alignment failures.')
    return 1 if failures else 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('bundle')
    args = parser.parse_args()
    sys.exit(check_bundle(args.bundle))
