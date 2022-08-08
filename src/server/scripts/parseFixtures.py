import re
import json
import datetime

def main():
    days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    timeRegex = "([01]?[0-9]|2[0-3]):[0-5][0-9]"


    with open("../data/pl-fixtures.txt","r") as f:
        month = None
        day = None
        fixtures = []
        for line in f:
            time = "16:00"
            if(line == "" or line == "\n"):
                continue

            words = line.split(" ")
            if(len(words) == 0):
                continue

            if(words[0] in days):
                _,day,month = words
                day = day.strip()
                month = month.strip()
                continue

            fixtureString = line

            isTime = re.search(timeRegex,words[0])
            if(isTime):
                time = words[0]
                fixtureString = fixtureString.replace(words[0],"")

            print(fixtureString)

            home,away = fixtureString.split(" v ")
            away = away.replace("*","").replace("(Sky Sports)","").replace("(Prime Video)","")    
            
            hour,minute = time.split(":")
            
            date = datetime.datetime(2022,months.index(month)+1,int(day),int(hour),int(minute))

            fixtures.append({"home":home.strip(),"away":away.strip(),"date":date.strftime("%m/%d/%Y, %H:%M:%S")})
        
        with open("../data/pl-fixtures.json","w") as jsonFile:
            json.dump(fixtures,jsonFile)
            



    

if __name__ == "__main__":
    main()