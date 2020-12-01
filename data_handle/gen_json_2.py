import json
from pypinyin import lazy_pinyin
import os
import random
print(os.getcwd())
res = []
num = []

def calcarr(arr):
    sum = 0
    for item in arr:
        sum += item
    return sum

with open("./data_handle/files/China.json",'r',encoding='UTF-8') as f:
    json_string = json.load(f)
    shen = json_string["citylist"]    #    ①中国
    temp = []
    tmpnum = []
    i = 0
    for item in shen:
        i = i+1
        if i%2==0 :
            continue
        #print(item)
        temp = []
        tmpnum = []
        print("==================")
        for area in item:
            if isinstance(item[area],list):
                tshi = []
                tshinum = []
                for shi in item[area]:  #③市区
                    tshi.append("".join(map(lambda x: x[0].upper() + x[1:].lower(), lazy_pinyin(shi['n']))))
                    tshinum.append(random.randint(5,60))
                temp.append(tshi)
                tmpnum.append(tshinum)
            else:
                #print("省份",item[area])  # ②省份
                temp.append("".join(map(lambda x: x[0].upper() + x[1:].lower(),lazy_pinyin(item[area]))))
        tmpnum.insert(0,calcarr(tshinum))
        res.append(temp)
        num.append(tmpnum)
print(res)
print(num)