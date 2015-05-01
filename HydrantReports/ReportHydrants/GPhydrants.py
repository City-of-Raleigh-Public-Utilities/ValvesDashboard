import arcpy, json, time, multiprocessing


#Environment Settings
arcpy.env.overwriteOutput = True

arcpy.env.workspace = os.path.join(os.path.dirname(sys.argv[0]), 'RPUD.sde')

outData = {}

hydrants = 'RPUD.wHydrants'
districts = 'RPUD.CombinedFireResponse'

#Get district name as user input
district = arcpy.GetParameterAsText(0)

today = time.strftime("%d-%m-%Y")
formatedTime = "%s 00:00:00, 'YYYY-MM-DD HH24:MI:SS'" % today

districtQuery = 'DISTRICT = "%s"' % district

#Create feature layerse

arcpy.MakeFeatureLayer_management(districts, "districts_lyr")

#Select hydrants in district
selectarea = arcpy.SelectLayerByAttribute_management("districts_lyr", 'NEW_SELECTION', districtQuery)


def GetFeatureCount(hydrants, selectarea, where, out):
    arcpy.MakeFeatureLayer_management(hydrants, "hydrants_lyr")
    selection = arcpy.SelectLayerByLocation_management("hydrants_lyr","INTERSECT", selectarea)
    selection2 = arcpy.SelectLayerByAttribute_management(selection, "SUBSET_SELECTION", where['sql'])
    outData[where['title']] = str(arcpy.GetCount_management(selection2).getOutput(0))
    return str(arcpy.GetCount_management(selection2).getOutput(0))


#Options loop through to generate stats
reportOptions = {
    "Inoperable": {
        "Public" {
            "title": "Inoperable (Public): ",
            "sql": "RFDSTATION IS NOT NULL AND OPERABLE = 'N' AND OWNEDBY <> 1"
        },
        "Private":{
            "title": "Inoperable (Private): ",
            "sql": "RFDSTATION IS NOT NULL AND OPERABLE = 'N' AND OWNEDBY = 1"
        }
    },
    "Repairs": {
        "Public" {
            "title": "Need Repair (Public): ",
            "sql": "RFDSTATION IS NOT NULL AND REPAIRNEED = 1 AND OWNEDBY <> 1")
        },
        "Private":{
            "title": "Need Repair (Private): ",
            "sql": "RFDSTATION IS NOT NULL AND REPAIRNEED = 1 AND OWNEDBY = 1"
        }
    },
    "Checked": {
        "Public" {
            "title": "Checked (Public): ,
            "sql": "RFDSTATION IS NOT NULL AND CHECKED IN ('Y','GPS','NEW') AND OWNEDBY <> 1")
        },
        "Private":{
            "title": "Checked (Private): ,
            "sql": "RFDSTATION IS NOT NULL AND CHECKED IN ('Y','GPS','NEW') AND OWNEDBY = 1"
        }
    },
    "New": {
        "Public" {
            "title": "New (Public): ,
            "sql": "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + formatedTime + ") AND OWNEDBY <> 1")
        },
        "Private":{
            "title": "New (Private): ,
            "sql": "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + formatedTime + ") AND OWNEDBY = 1"
        }
    }
}



if __name__ == "__main__":

    jobs = []
    for k in reportOptions:
        #Create Public Process
        process = multiprocessing.Process(target=GetFeatureCount, args=(hydrants, selectarea, reportOptions[k]['Public'], outData))
        jobs.append(process)
        #Create Private Process
        process = multiprocessing.Process(target=GetFeatureCount, args=(hydrants, selectarea, reportOptions[k]['Private'], outData))
        jobs.append(process)

    for j in jobs:
        j.start()

    for j in jobs:
        j.join()
