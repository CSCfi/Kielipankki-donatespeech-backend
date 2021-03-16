import sys
import json
import uuid

def validate(schedule):
    if schedule == None:
        print('error: no schedule')
        return False

    item_ids = []
    if 'itemId' in schedule:
        item_ids.append(schedule['itemId'])
    
    for item in schedule['items']:
        item_ids.append(item['itemId'])

    print('all item IDs:')
    print(item_ids)

    item_id_set = set(item_ids)
    if len(item_ids) != len(item_id_set):
        print('error: all item IDs are not unique')
        return False
    else:
        print('item IDs seem to be unique')

    if 'start' in schedule:
        print('Schedule has start element')
    if 'finish' in schedule:
        print('Schedule has finish element')

    items = schedule['items']
    print('Schedule has {} items'.format(len(items)))
    print()

    for index, item in enumerate(items):
        rec = ''
        if item['isRecording'] :
            rec = '*** RECORDING ***'
        itemId = item['itemId']

        print('Item #{}:  {}'.format(index + 1, rec))
        if itemId == 'fa3ecb10-1128-4c8c-a838-600a0faadc2e':
            print('Äidinkielikysely')
            print()
            continue
        if itemId == 'e3264046-a642-46de-a9e7-c55933ee3739':
            print('Ikäkysely')
            print()
            continue
        if itemId == '8bbb8e5d-56a2-4082-9429-233ff2a5e53f':
            print('Sukupuolikysely')
            print()
            continue
        if itemId == '6ef34957-41e7-487e-aa0c-a40c93ed9251':
            print('Murrealuekysely')
            print()
            continue
        if itemId == '626d3fb5-6b82-4d5d-bdde-1637e571ca28':
            print('Asuinpaikkakysely')
            print()
            continue
        if itemId == 'dad311ea-3e7f-4d16-b76b-0c94aaf9fc73':
            print('Syntymäpaikkakysely')
            print()
            continue
        if itemId == '5103c614-1df4-4ffd-a670-30ef78e0a613':
            print('Koulutustaustakysely')
            print()
            continue

        print('itemId = {}  kind = {}  itemType = {}'.format(itemId, item['kind'], item['itemType']))
        print('\ttitle = "{}"'.format(item['title']))
        print('\tbody1 = "{}"'.format(item['body1']))
        print('\tbody2 = "{}"'.format(item['body2']))
        print('\turl = "{}"'.format(item['url']))

        if 'start' in item:
            start = item['start']
            print('Item has start state:')
            print('\ttitle = "{}"'.format(start['title']))
            print('\tbody1 = "{}"'.format(start['body1']))
            print('\tbody2 = "{}"'.format(start['body2']))
            if 'url' in start:
                print('\turl = "{}"'.format(start['url']))

        if 'recording' in item:
            print('Item has recording state:')
            recording = item['recording']
            print('\ttitle = "{}"'.format(recording['title']))
            print('\tbody1 = "{}"'.format(recording['body1']))
            print('\tbody2 = "{}"'.format(recording['body2']))
            if 'url' in recording:
                print('\turl = "{}"'.format(recording['url']))

        if 'finish' in item:
            print('Item has finish state:')
            finish = item['finish']
            print('\ttitle = "{}"'.format(finish['title']))
            print('\tbody1 = "{}"'.format(finish['body1']))
            print('\tbody2 = "{}"'.format(finish['body2']))
            if 'url' in finish:
                print('\turl = "{}"'.format(finish['url']))

        print()

def main(arguments):
    schedule = {}

    if len(arguments) < 2:
        print('Need JSON schedule file')
        sys.exit(-1)
    else:
        filename = arguments[1]
        with open(filename) as f:
            schedule = json.load(f)

    result = validate(schedule)
    if result:
        sys.exit(0)
    else:
        sys.exit(1)
    
if __name__ == '__main__':
    main(sys.argv)
