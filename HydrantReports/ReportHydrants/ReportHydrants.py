# -- coding: cp1252 --
import os, sys, arcpy, email,csv, smtplib, datetime, logging
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email.Utils import COMMASPACE, formatdate
from email import Encoders

arcpy.env.overwriteOutput = True

logging.basicConfig(filename=os.path.join(os.path.dirname(sys.argv[0]),'execute.log'),level=logging.INFO, format='%(asctime)s %(message)s')
logging.warning('is when ReportHydrants.py last ran.')

def getDate():
    with open(os.path.join(os.path.dirname(sys.argv[0]),'execute.log'), 'r') as log:
        dateList = []
        for line in log.readlines():
            row = line.split(',')
            for i in row:
                dateList.append(i)
        if len(dateList) == 2:
            user_input = '2014-04-01' 
            formated_date = "'{0}', 'YYYY-MM-DD HH24:MI:SS'".format(user_input)  
            return formated_date
        else:   
            raw_date = dateList[len(dateList) - 4]
            formated_date = "'{0}', 'YYYY-MM-DD HH24:MI:SS'".format(raw_date)
            return formated_date

NewDate = getDate()



def GetFeatureCount(fLayer, selectarea, where):
    featurelayer = arcpy.MakeFeatureLayer_management(fLayer,"hydrant_layer")
    selection = arcpy.SelectLayerByLocation_management("hydrant_layer","INTERSECT", selectarea)
    selection2 = arcpy.SelectLayerByAttribute_management(selection, "SUBSET_SELECTION", where)
    return str(arcpy.GetCount_management(selection2).getOutput(0))
def WriteTotalsToFile(path,chk,inop,rep,new):
    cntFile = open(path,'wb')
    cntWriter = csv.writer(cntFile)
    cntWriter.writerow(["checked",chk])
    cntWriter.writerow(["inoperable",inop]);
    cntWriter.writerow(["repair",rep])
    cntWriter.writerow(["new",new])
    cntFile.close()
def GetDayTotals(path):
    cntFile = open(path,'rb')
    cntReader = csv.reader(cntFile)
    dict1 = dict()
    for row in cntReader:
        dict1[row[0]] = row[1]
    return dict1

def SendMail(fpaths, attach, body, toList, subject):
    HOST = "cormailgw2.raleighnc.gov"
    FROM = "gis@raleighnc.gov"
    #TO = "HydrantRepairDL@raleighnc.gov,RFDShiftPersonnelDL@raleighnc.gov,gis@raleighnc.gov"
    #TO = "gis@raleighnc.gov,Colleen.Sharpe@raleighnc.gov,Whit.Wheeler@raleighnc.gov,Andy.Brogden@raleighnc.gov,Patrick.Barnhouse@raleighnc.gov,Edward.Smith@raleighnc.gov,Elvis.Medlin@raleighnc.gov,Emily.Walker@raleighnc.gov,Kenneth.Neal@raleighnc.gov,Homero.Ramirez@raleighnc.gov,Scott.Jackson@raleighnc.gov,RFDCommandStaff@raleighnc.gov"
    #TO = "gis@raleighnc.gov"
    TO = toList
    msg = MIMEMultipart()
    msg['From'] = FROM
    msg['To'] = TO
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject
    msg.attach(MIMEText(body))
    if attach:
        for fpath in fpaths:
            part = MIMEBase('text/csv', 'octet-stream')
            part.set_payload(open(fpath,'rb').read())
            Encoders.encode_base64(part)
            part.add_header('Content-Disposition', 'attachment; filename="%s"' % os.path.basename(fpath))
            msg.attach(part)
    server = smtplib.SMTP(HOST)
    server.sendmail(FROM, TO.split(","), msg.as_string())
    server.close()
    for fpath in fpaths:
        os.remove(fpath)



def selectTown(town):
    print "Reporting Hydrants..."
    fcName = 'RPUD.wHydrant'
    juris = town
    emailSub = "Hydrant Report - "+juris.capitalize()
    sde = os.path.join(os.path.join(os.path.dirname(sys.argv[0]),"rpud.sde"),fcName)
    selectarea = os.path.join(os.path.dirname(sys.argv[0]),r"MergerAreas.gdb/%s") % juris
    featurelayer = arcpy.MakeFeatureLayer_management(sde,"hydrant_layer")
    intersect = arcpy.SelectLayerByLocation_management("hydrant_layer","INTERSECT", selectarea)
    
    cnt = 0
    now = datetime.datetime.now()
    #set time stamp for CSV file
    year = now.year
    month = now.month
    if month < 10:
        month = "0"+str(month)
    day = now.day
    if day < 10:
        day = "0"+str(day)
    stamp = str(year)+str(month)+str(day)



    dicts = [{'query':"RFDSTATION IS NOT NULL AND OWNEDBY <> 1 AND (REPAIRNEED = 1 OR OPERABLE = 'N')",
              'path':os.path.join(os.path.dirname(sys.argv[0]),"Repairs_Public_"+stamp+".csv")},
            {'query':"RFDSTATION IS NOT NULL AND OWNEDBY = 1 AND (REPAIRNEED = 1 OR OPERABLE = 'N')",
              'path':os.path.join(os.path.dirname(sys.argv[0]),"Repairs_Private_"+stamp+".csv")}]
    filepaths = []
    for item in dicts:
             
        filepath = item['path']         
    
        filepaths.append(filepath)

        rows = arcpy.SearchCursor(intersect, item['query'], "", "STNUM, STENUM,STPREFIX, STNAME, STTYPE, STSUFFIX, OWNEDBY, MANUFACTURER, HYDRANTYEAR, VALVESIZE, PUMPERNOZZLETYPE, SIDENOZZLETYPE, OPERABLE, REPAIRNEED, NOTES, RFD_NOTES, FACILITYID, CHECKED, JURISID, RFDSTATION","OPERABLE A;REPAIRNEED D")
        
        with open(filepath,'wb') as f:
            writer = csv.writer(f)
            #write column header
            writer.writerow(['RALEIGH ID', 'JURISID','STREET NUMBER','SUITE_NUMBER','STREET DIRECTION','STREET NAME','STREET TYPE', 'STREET SUFFIX','OWNERSHIP','MANUFACTURER', 'YEAR', 'VALVE DIAM','PUMPER NOZZLE','SIDE NOZZLE','OPERABLE','NEEDS REPAIR','NOTES', 'RFD_NOTES', 'CHECKED','STATION'])
            for row in rows:
                notes = ""
                if row.NOTES:
                    notes = unicode(row.NOTES).encode("utf-8")
                #replace NA with blank
                stpre = ""
                if row.STPREFIX != "NA":
                    stpre = row.STPREFIX
                sttype = ""
                if row.STTYPE != "NA":
                    sttype = row.STTYPE
                stsuf = ""
                if row.STSUFFIX != "NA":
                    stsuf = row.STSUFFIX

                #write row to CSV        
                writer.writerow([row.FACILITYID, row.JURISID, unicode(row.STNUM).encode("utf-8"), unicode(row.STENUM).encode("utf-8"), stpre, unicode(row.STNAME).encode("utf-8"), sttype, stsuf, row.OWNEDBY,row.MANUFACTURER, row.HYDRANTYEAR, row.VALVESIZE, row.PUMPERNOZZLETYPE, row.SIDENOZZLETYPE, row.OPERABLE,row.REPAIRNEED, notes, row.RFD_NOTES, row.CHECKED, row.RFDSTATION])
                cnt+=1
                del row
            del rows
            f.close()


    #fLayer = arcpy.MakeFeatureLayer_management(sde)
    
    #get count of checked, repairs, need GPS, and new hydrants    
    print "Counting Features..."
    inopTotPub = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND OPERABLE = 'N' AND OWNEDBY <> 1")
    print "Inoperable (Public): "+str(inopTotPub)
    inopTotPriv = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND OPERABLE = 'N' AND OWNEDBY = 1")
    print "Inoperable (Private): "+str(inopTotPriv)
    repTotPub = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND REPAIRNEED = 1 AND OWNEDBY <> 1")
    print "Need Repair (Public): "+str(repTotPub)    
    repTotPriv = GetFeatureCount(sde, selectarea,"RFDSTATION IS NOT NULL AND REPAIRNEED = 1 AND OWNEDBY = 1")
    print "Need Repair (Private): "+str(repTotPriv)    
    chkTotPub = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CHECKED IN ('Y','GPS','NEW') AND OWNEDBY <> 1")
    print "Checked (Public): "+str(chkTotPub)    
    chkTotPriv= GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CHECKED IN ('Y','GPS','NEW') AND OWNEDBY = 1")
    print "Checked (Private): "+str(chkTotPriv)    
    newTotPub = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + NewDate + ") AND OWNEDBY <> 1")
    print "New (Public): "+str(newTotPub)    
    newTotPriv = GetFeatureCount(sde, selectarea, "RFDSTATION IS NOT NULL AND CREATEDON >= TO_DATE(" + NewDate + ") AND OWNEDBY = 1")
    print "New (Private): "+str(newTotPriv)    

    inopTot = int(inopTotPub)+int(inopTotPriv)
    repTot = int(repTotPub)+int(repTotPriv)
    chkTot = int(chkTotPub)+int(chkTotPriv)
    newTot = int(newTotPub)+int(newTotPriv)
    
    cntFilePath= os.path.join(os.path.dirname(sys.argv[0]),"count_"+juris+".csv")

    inopDay = 0
    repDay = 0
    chkDay = 0
    newDay = 0

    if (os.path.exists(cntFilePath)):
        #get totals from previous day from count.csv
        cntDict = GetDayTotals(cntFilePath)
        inopDay = int(inopTot) - int(cntDict['inoperable'])
        repDay = int(repTot) - int(cntDict['repair'])
        chkDay = int(chkTot) - int(cntDict['checked'])
        newDay = int(newTot) - int(cntDict['new'])
        #overwrite count.csv with new totals
        print "Writing Totals To File"
        WriteTotalsToFile(cntFilePath, chkTot, inopTot, repTot, newTot)
    else:
        inopDay = inopTot
        repDay = repTot
        chkDay = chkTot
        newDay = newTot
        #write totals to count.csv
        WriteTotalsToFile(cntFilePath, chkTot, inopTot, repTot, newTot)
    #write email message
    print "Sending email..."
    message = "Hydrant Totals for "+str(month)+"/"+str(day)+"/"+str(year)+":\n"
    message +="Checked: "+str(chkDay)+"\n"
    message +="Inoperable: "+str(inopDay)+"\n"
    message +="Need Repair: "+str(repDay)+"\n"
    message +="New Hydrants: "+str(newDay)+"\n\n"
    message +="Hydrants Totals for Project:\n"
    message +="Checked (Public): "+str(chkTotPub)+"\n"
    message +="Checked (Private): "+str(chkTotPriv)+"\n"
    message +="Inoperable (Public): "+str(inopTotPub)+"\n"
    message +="Inoperable (Private): "+str(inopTotPriv)+"\n"
    message +="Need Repair (Public): "+str(repTotPub)+"\n"
    message +="Need Repair (Private): "+str(repTotPriv)+"\n"
    message +="New Hydrants (Public): "+str(newTotPub)+"\n"
    message +="New Hydrants (Private): "+str(newTotPriv)+"\n"


    # if town == 'wakeforest':
    #     SendMail(filepaths, cnt>0, message,"HydrantRepairDL-WakeForest@raleighnc.gov",emailSub)
    # if town == 'zebulon':
    #     SendMail(filepaths, cnt>0, message,"HydrantRepairDL-Zebulon@raleighnc.gov", emailSub)
    # if town == 'wendell':
    #     SendMail(filepaths, cnt>0, message,"HydrantRepairDL-Wendell@raleighnc.gov", emailSub)
    # if town == 'garner':
    #     SendMail(filepaths, cnt>0, message,"HydrantRepairDL-Garner@raleighnc.gov", emailSub)
    # if town == 'rolesville':
    #     SendMail(filepaths, cnt>0, message,"HydrantRepairDL-Rolesville@raleighnc.gov", emailSub)
    # if town == 'raleigh':        
    #     SendMail(filepaths,cnt>0,message, "HydrantRepairDL-Raleigh@raleighnc.gov", emailSub)
    # if town == 'knightdale':        
    #     SendMail(filepaths,cnt>0,message, "HydrantRepairDL-Knightdale@raleighnc.gov", emailSub)

    SendMail(filepaths, 1, message,"Corey.White@raleighnc.gov",emailSub)

# townList = ['raleigh', 'wakeforest', 'rolesville', 'garner', 'wendell', 'zebulon', 'knightdale'] knightdale
# for t in townList:
#     selectTown(t)
                      
selectTown('knightdale')
