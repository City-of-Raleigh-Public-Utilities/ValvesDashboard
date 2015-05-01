# -- coding: cp1252 --
import os, sys, arcpy, email,csv, smtplib, datetime, logging
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email.Utils import COMMASPACE, formatdate
from email import Encoders

logging.basicConfig(filename=os.path.join(os.path.dirname(sys.argv[0]),'execute.log'),level=logging.INFO, format='%(asctime)s %(message)s')
logging.warning('is when this event was logged.')

arcpy.env.overwriteOutput = True


def SendMail(fpath, attach, body, toList, subject):
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
        #for fpath in fpaths:
        part = MIMEBase('text/csv', 'octet-stream')
        part.set_payload(open(fpath,'rb').read())
        Encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment; filename="%s"' % os.path.basename(fpath))
        msg.attach(part)
    server = smtplib.SMTP(HOST)
    server.sendmail(FROM, TO.split(","), msg.as_string())
    server.close()
    #for fpath in fpaths:
    os.remove(fpath)

def selectTown(town):
    selectarea = os.path.join(os.path.dirname(sys.argv[0]),r"MergerAreas.gdb/%s") % town
    featurelayer = arcpy.MakeFeatureLayer_management(sde,"hydrant_layer")
    selection = arcpy.SelectLayerByLocation_management("hydrant_layer","INTERSECT", selectarea)
    rows = arcpy.SearchCursor(selection,"REPAIRNEED = 1 OR OPERABLE = 'N'","", "STNUM, STENUM, STPREFIX, STNAME, STTYPE, STSUFFIX, OWNEDBY, MANUFACTURER, HYDRANTYEAR, VALVESIZE, PUMPERNOZZLETYPE, SIDENOZZLETYPE, OPERABLE, REPAIRNEED, NOTES, JURISID, CHECKED, EDITEDON","EDITEDON A")
    filepath = os.path.join(os.path.dirname(sys.argv[0]),"%s_export_"+stamp+".csv") % town
    with open(filepath, 'wb') as f:
        writer = csv.writer(f)
        writer.writerow(['ID','STREET NUMBER','SUITE_NUMBER','STREET DIRECTION','STREET NAME','STREET TYPE', 'STREET SUFFIX','OWNEDBY','MANUFACTURER', 'YEAR', 'VALVE DIAM','PUMPER NOZZLE','SIDE NOZZLE','OPERABLE','NEEDS REPAIR','NOTES','CHECKED', 'EDITEDON'])
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

            writer.writerow([row.JURISID, unicode(row.STNUM).encode("utf-8"), unicode(row.STENUM).encode("utf-8"), stpre, unicode(row.STNAME).encode("utf-8"), sttype, stsuf, row.OWNEDBY, row.MANUFACTURER, row.HYDRANTYEAR, row.VALVESIZE, row.PUMPERNOZZLETYPE, row.SIDENOZZLETYPE, row.OPERABLE,row.REPAIRNEED, notes, row.CHECKED, row.EDITEDON])
            del row
        del rows
        f.close()
    # "gis@raleighnc.gov,Colleen.Sharpe@raleighnc.gov,Carl.Stearns@raleighnc.gov,Anthony.Vogt@raleighnc.gov,Whit.Wheeler@raleighnc.gov,Kelly.Phillips@raleighnc.gov,Ken.Best@raleighnc.gov,Elvis.Medlin@raleighnc.gov,David.Woodlief@raleighnc.gov,Jeremy.Isgrigg@raleighnc.gov"   
    if town == 'wakeforest':
        SendMail(filepath, True, "See attached file for hydrants that are inoperable and/or need repair","Corey.White@raleighnc.gov, Jeremy.Isgrigg@raleighnc.gov, Colleen.Sharpe@raleighnc.gov, HydrantRepairDL-WakeForest@raleighnc.gov","----- TEST -----Wake Forest Hydrant Report")
    if town == 'zebulon':
        SendMail(filepath, True, "See attached file for hydrants that are inoperable and/or need repair","Corey.White@raleighnc.gov, Colleen.Sharpe@raleighnc.gov, Tobie.Mitchell@raleighnc.gov, HydrantRepairDL-Zebulon@raleighnc.gov","----- TEST -----Zebulon Hydrant Report")
    if town == 'wendell':
        SendMail(filepath, True, "See attached file for hydrants that are inoperable and/or need repair","Corey.White@raleighnc.gov, Colleen.Sharpe@raleighnc.gov, Tobie.Mitchell@raleighnc.gov, HydrantRepairDL-Wendell@raleighnc.gov","----- TEST -----Wendell Hydrant Report")
    if town == 'garner':
        SendMail(filepath, True, "See attached file for hydrants that are inoperable and/or need repair","Corey.White@raleighnc.gov, Colleen.Sharpe@raleighnc.gov, trooks@garnerfire.com, mbishop@garnerfire.com, HydrantRepairDL-Garner@raleighnc.gov","----- TEST -----Garner Hydrant Report")
    if town == 'rolesville':
        SendMail(filepath, True, "See attached file for hydrants that are inoperable and/or need repair","Corey.White@raleighnc.gov, Colleen.Sharpe@raleighnc.gov, Jeremy.Isgrigg@raleighnc.gov, HydrantRepairDL-Rolesville@raleighnc.gov","----- TEST -----Rolesville Hydrant Report")





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

sde = os.path.join(os.path.dirname(sys.argv[0]),"RPUD.sde/RPUD.wHydrant")
townList = ['wakeforest', 'rolesville', 'garner', 'wendell', 'zebulon']
for t in townList:
    selectTown(t)
    



