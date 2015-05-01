import arcpy, os, sys
try:
    print "Calculating Station Numbers..."
    sde = os.path.join(os.path.dirname(sys.argv[0]),"rpud.sde")
    hydFc = os.path.join(sde,"RPUD.wHydrant")
    gridFc = os.path.join(sde,"RALEIGH.RFD_PREPLAN_GRID")
    try:
        arcpy.MakeFeatureLayer_management(hydFc,"hyd_layer")
    except:
        pass
    try:
        arcpy.MakeFeatureLayer_management(gridFc,"grid_layer")
    except:
        pass
    gridCur = arcpy.SearchCursor(gridFc, "STATION IS NOT NULL", "", "STATION","STATION")
    for grid in gridCur:
        print grid.STATION
        arcpy.SelectLayerByAttribute_management("grid_layer", "NEW_SELECTION","STATION = '"+str(grid.STATION)+"'")
        arcpy.SelectLayerByLocation_management("hyd_layer","INTERSECT","grid_layer","","NEW_SELECTION")
        arcpy.SelectLayerByAttribute_management("hyd_layer","SUBSET_SELECTION","RFDSTATION IS NULL")
        cnt = int(str(arcpy.GetCount_management("hyd_layer")))
        print str(cnt)
        if cnt > 0:
            arcpy.CalculateField_management("hyd_layer", "RFDSTATION",grid.STATION)
    del grid
    del gridCur
except:
    print arcpy.GetMessages()
    
