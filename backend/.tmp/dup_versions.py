#!/usr/bin/env python3

import json
import subprocess
from collections import defaultdict


def main():
    metadata = json.loads(subprocess.check_output(["cargo", "metadata", "--format-version", "1"]))
    deps = defaultdict(list)
    for dep in metadata["resolve"]["nodes"]:
        name, version, _ = dep["id"].split(" ")
        deps[name].append(version)

    for name, versions in deps.items():
        if len(versions) > 1:
            print("{} has multiple version: {}".format(name, versions))


if __name__ == '__main__':
    main()