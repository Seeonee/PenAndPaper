import os
import json

MASTER = '_index.json'

def buildFiles():
    files = {}
    for file in os.listdir('.'):
        if file[0] == '_':
            continue
        # read it in as json
        # get its level, slots, and types
        with open(file, 'r') as fin:
            doc = json.load(fin)
        level = doc['level']
        slots = ','.join(doc['slots'])
        types = doc['types']
        if types and len(types):
            types = ','.join(types)
        else:
            types = ''
        files[file] = {'level': level,
                       'slots': slots,
                       'types': types}
    return files

def main():
    files = buildFiles()
    with open(MASTER, 'w') as fout:
        fout.write(json.dumps(files,
                              sort_keys=True,
                              indent=4))

if __name__ == '__main__':
    main()
