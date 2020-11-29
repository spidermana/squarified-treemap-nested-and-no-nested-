import json
from pypinyin import lazy_pinyin
import random
res = {}
with open("./files/China.json",'r',encoding='UTF-8') as f:
    json_string = json.load(f)
    shen = json_string["citylist"]    #    ①中国
    res["children"] = []
    res["name"] = "China"
    temp = {}
    for item in shen:
        #print(item)
        print("==================")
        for area in item:
            if isinstance(item[area],list):
                for shi in item[area]:  #③市区
                    print("市",shi['n'])
                    res["children"][-1]["children"].append({   \
                        "name":"".join(map(lambda x: x[0].upper() + x[1:].lower(), lazy_pinyin(shi['n']))), \
                        "value" : random.randint(10,90), \
                        "colname" : "City"    
                    })
            else:
                print("省份",item[area])  # ②省份
                res["children"].append({"name":"".join(map(lambda x: x[0].upper() + x[1:].lower(),lazy_pinyin(item[area]))) , "children":[] , "colname": "Province"})

with open("./files/China_data.json","w") as filenew:
    json.dump(res,filenew)