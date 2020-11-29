import json

res = {}
with open("./files/China.json",'r',encoding='UTF-8') as f:
    json_string = json.load(f)
    shen = json_string["citylist"]    #    ①中国
    temp = {}
    for item in shen:
        #print(item)
        print("==================")
        for area in item:
            if isinstance(item[area],list):
                for shi in item[area]:  #③市区
                    print("市",shi['n'])
                    if 'a' in shi:
                        for qu in shi["a"]:
                            print("对应区",qu)
                    print("///////////////////////")
                    
            else:
                print("省份",item[area])  # ②省份