import sublime, sublime_plugin, re, operator
from itertools import product
import html

def returnContext(self):
    returnString = self.view.find('surveyType=(.*)',0)
    if returnString:
        returnString = self.view.substr(returnString)
        return returnString[11:14]
    else:
        return ' '

def tidyQuestionInput(input):
    input = input.strip()
    input = re.sub(r"^(\w?\d+)\.(\d+)",r"\1_\2",input)

    while "\n\n" in input:
        input = input.replace("\n\n", "\n")


    label = re.split(r"^([a-zA-Z0-9-_]+)+(\.|:|\)|\s)", input, 1)[1]

    input = re.split(r"^([a-zA-Z0-9-_]+)+(\.|:|\)|\s)", input, 1)[-1]

    if label[0].isdigit():
        label = "Q" + label
    if "@" in input:
        title = input[0:(input.index("@"))]
    else:
        input_array = []
        if "<row" in input:
            input_array.append(input.index("<row"))
        if "<col" in input:
            input_array.append(input.index("<col"))
        if "<choice" in input:
            input_array.append(input.index("<choice"))
        if "<comment" in input:
            input_array.append(input.index("<comment"))
        if "<group" in input:
            input_array.append(input.index("<group"))
        if "<net" in input:
            input_array.append(input.index("<net"))
        if "<exec" in input:
            input_array.append(input.index("<exec"))
        if "<insert" in input:
            input_array.append(input.index("<insert"))
        if len(input_array) == 0:
            title = input
        else:
          input_index = min(input_array)
          title = input[0:input_index]


    input = input.replace(title, "")
    return [input, label, title]


def fixUniCode(input):
    input = input.replace(u"\u2019", "'").replace(u"\u2018", "'").replace(u"\u201C", "\"").replace(u"\u201D", "\"")
    input = re.sub('&\s', '&amp; ',input)
    return input



def index_exists(arr, i):
    return (0 <= i < len(arr)) or (-len(arr) <= i < 0)


class makeStrongCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                set_text = '<b>{}</b>'.format(textr)
                self.view.replace(edit,sels, set_text)
                
            except Exception as e:
                print (e) 


class makeQnameCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                set_text = '<div class=\"q-name\">{}</div> '.format(textr)
                self.view.replace(edit,sels, set_text)
                
            except Exception as e:
                print (e) 

class makeUnderlineCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                set_text = '<u>{}</u>'.format(textr)
                self.view.replace(edit,sels, set_text)
                
            except Exception as e:
                print (e) 

class makeStrongColorCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                set_text = '<span class=\"f-highlight\">{}</span>'.format(textr)
                self.view.replace(edit,sels, set_text)
                
            except Exception as e:
                print (e)

class makeUnderlineColorCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                set_text = '<span class=\"f-highlight\"><u>{}</u></span>'.format(textr)
                self.view.replace(edit,sels, set_text)
                
            except Exception as e:
                print (e) 


class makeVideoCommand(sublime_plugin.TextCommand) :
		def run (self, edit):
			try :
				sels = self.view.sel()
				
				for sel in sels :
					input = self.view.substr(sel)

					if '\n' in input :
						findn = input.find('\n')
						title = input[findn:]
						input = input[:findn]
					else :
						title = ''

					inputLabelTitle = tidyQuestionInput(input)
					input = inputLabelTitle[0]
					label = inputLabelTitle[1]
					videoID = inputLabelTitle[2]
					videoText = """
<text 
	label="%s"
	optional="0"
	size="25"
	sst="0"
	uses="videoplayer.1"
	videoplayer:player_id="SybkoGSJb"
	videoplayer:video_id="%s">
	<title>%s</title>
</text>
<suspend/>"""%(label.strip(), videoID.strip(),title.strip())
					return self.view.replace(edit,sel,videoText)

					
			except :
				print('video make error')


class makeRowsMatchValuesGroupCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)

                groupSplit = input.split("\n")
                groupSplit = [i for i in groupSplit if not i.strip()==""]

                groupcnt = 1
                otherGroup = 98

                for ix,tx in enumerate(groupSplit) :
                    chk = tx.replace("\t\t"," ").replace("\t"," ").find(" ")
                    groupchk = tx[:chk]
                    
                    if not groupchk.isdigit() :
                        otherText = ["기타","없음","other","others","none"]
                        extra = ""
                        otherchk = tx.strip().replace(" ","").lower()
                        if otherchk in otherText :
                            extra = ' randomize="0"'
                            gcnt = otherGroup
                        else :
                            gcnt = groupcnt

                        groupSplit[ix] = '<group label="g%s"%s>%s</group>'%(gcnt,extra,tx.strip())

                        if otherchk in otherText :
                            otherGroup = otherGroup + 1
                        else :
                            groupcnt = groupcnt + 1

                
                groupIndex = [i for i in range(0,len(groupSplit)) if "<group" in groupSplit[i]]

                groupInput = [groupSplit[groupIndex[g]:groupIndex[g+1]] if index_exists(groupIndex, g+1) else groupSplit[groupIndex[g]:] for g in range(0,len(groupIndex)) ]

                groupDict = {ix:[tx[0].strip(),tx[1:]] for ix,tx in enumerate(groupInput)}
                
                
                printPage = ''

                for inp in sorted(groupDict.items()) :
                    groupTag = inp[1][0]
                    
                    groupText = groupTag.replace(' randomize="0"','').replace('"','').split("label=")[1]
                    splitcnt = groupText.find(">")
                    
                    groupLabel = groupText[:splitcnt]

                    input = '\n'.join(inp[1][1])
                    input = input.strip()
                    input = fixUniCode(input)


                    
                    #SPLIT UP INTO ROWS
                    input = input.split("\n")
                    #ebay has a different openSize
                    openSize =  '45' if docType =='EBA' else '25'
                    #ITERATE ROWS
                    printPage += "%s\n"%(groupTag)

                    for line in input :
                        if inp :
                            line = line.strip()
                            #SPLIT ON WHITESPACE -- REMOVE LEADING AND TRAILING WS
                            parts = re.split(r"\s",line,1)

                            #GET RID OF EXTRA SPACES
                            ordinal= parts[0].strip()
                            ordinal= ordinal.rstrip('.')
                            ordinal= ordinal.rstrip(')')

                            content = ''

                            #GET RID OF EXTRA SPACES
                            if len(parts) == 2:
                                content = parts[1].strip()

                            extra=""
                            otherArr1 = ["기타","other","others"]
                            otherArr2 = ["구체적","자세히","specify"]

                            noneArr = ["모름","없음","none"]

                            if [i for i in otherArr1 if i.lower() in content.lower()] and [i for i in otherArr2 if i.lower() in content.lower()] :
                               content = content.replace("_", "")
                               extra=' open=\"1\" openSize=\"'+openSize+'\" randomize=\"0\"'
                            elif [i for i in noneArr if i.lower() in content.lower()] :
                               content = content.replace("_", "")
                               extra=' exclusive=\"1\" randomize=\"0\"'


                            #COMPOSE ROW
                            printPage += "  <row label=\"r%s\" groups=\"%s\" value=\"%s\"%s>%s</row>\n" % (ordinal,groupLabel,ordinal, extra, content)


                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)




class changeLabelCodeCommand(sublime_plugin.TextCommand) :
    def run (self,edit):
        try:
            sels = self.view.sel()
            
            for sel in sels :
                s = self.view.substr(sel)
                s = s.strip()
                s = s.replace('\t',' ')
                
                s = [i.strip() for i in s.split("\n") if not i.strip()==""]

                st = [i.split("\t\t") if "\t\t" in i else [i[:i.rfind(" ")].strip(),i[i.rfind(" "):].strip()] if i[i.rfind(" "):].strip().isdigit() else [i.strip(),""] for i in s]

                set_text = ["%s\t\t%s"%(0 if i[1] == "0" else i[1].lstrip("0"),i[0].strip()) for i in st]

                printPage = ""

                for p in set_text :
                    printPage += "%s\n"%p
                
                self.view.replace(edit,sel, printPage)

        except Exception as e:
            print (e)

class gridColCommand(sublime_plugin.TextCommand) :
    def run (self,edit):
        try:
            sels = self.view.sel()
            
            for sel in sels :
                s = self.view.substr(sel)
                s = s.replace("\n","")
                s = s.replace("[","**(")
                s = s.replace("]",")__")
                s = [i.strip() for i in s.split("__")]
                s = " ".join(s)
                s = s.split("**")


                printPage = ""

                for i in s :
                    if "(" in i and ")" in i :
                        ix1 = i.find("(")
                        ix2 = i.find(")")
                        icode = i[ix1+1:ix2]
                        printPage += "%s\t%s\n"%(icode,i.strip())

                self.view.replace(edit,sel, printPage)

        except Exception as e:
            print (e)

#view.run_command('make_syntax')

def getOtions(qText) :
    optionTag = qText[qText.find('<')+1:qText.find('>')].split("\n")
    optionDict = {o.split('=')[0]:o.split('=')[1].replace('"','').strip() for o in optionTag if '=' in o}

    return optionDict

def getElementOptions(qText) :
    optionTag = qText[qText.find('<')+1:qText.find('>')].replace('"','')
    optionTag = optionTag.replace(' ','\n')
    optionTag = optionTag.split('\n')
    optionTag = {i.split('=')[0]:i.split('=')[1] for i in optionTag if '=' in i}
    
    return optionTag

def makeElements(lines,defineDict) :
    rowLabels = []
    rowValues = []
    colLabels = []
    colValues = []
    choiceLabels = []
    choiceValues = []
    noanswerLabels = []
    noanswerValues = []

    for l in lines :
        if '<row' in l.strip() :
            rowLabels.append(getElementOptions(l.strip())['label'].upper().replace('/',''))

            if 'value' in l.strip() :
                rowValues.append(int(getElementOptions(l.strip())['value'].upper().replace('/','')))

        if '<insert' in l.strip() and ('rows' in l.strip() or (not 'cols' in l.strip() and not 'choices' in l.strip()) ):
            defineLabel = getElementOptions(l.strip())['source'].replace('/','')
            dfList = defineDict[defineLabel]
            for i in dfList[0] :
                rowLabels.append(i)
            for v in dfList[1] :
                rowValues.append(v)

        if '<col' in l.strip() :
            colLabels.append(getElementOptions(l.strip())['label'].upper().replace('/',''))

            if 'value' in l.strip() :
                colValues.append(int(getElementOptions(l.strip())['value'].upper().replace('/','')))

        if '<insert' in l.strip() and 'cols' in l.strip () :
            defineLabel = getElementOptions(l.strip())['source'].replace('/','')
            dfList = defineDict[defineLabel]
            for i in dfList[0] :
                colLabels.append(i)
            for v in dfList[1] :
                colValues.append(v)

        if '<choice' in l.strip() :
            choiceLabels.append(getElementOptions(l.strip())['label'].upper().replace('/',''))

            if 'value' in l.strip() :
                choiceValues.append(int(getElementOptions(l.strip())['value'].upper().replace('/','')))

        if '<insert' in l.strip() and 'choices' in l.strip () :
            defineLabel = getElementOptions(l.strip())['source'].replace('/','')
            dfList = defineDict[defineLabel]
            for i in dfList[0] :
                choiceLabels.append(i)
            for v in dfList[1] :
                choiceValues.append(v)

        if '<noanswer' in l.strip() :
            noanswerLabels.append(getElementOptions(l.strip())['label'].upper().replace('/',''))

            if 'value' in l.strip() :
                noanswerValues.append(int(getElementOptions(l.strip())['value'].upper().replace('/','')))

    returnDict = {
        'rowLabels':rowLabels,
        'rowValues':rowValues,
        'colLabels':colLabels,
        'colValues':colValues,
        'choiceLabels':choiceLabels,
        'choiceValues':choiceValues,
        'noanswerLabels':noanswerLabels,
        'noanswerValues':noanswerValues
    }

    return returnDict

def returnNoanswer(qid,noanswerLabels, noanswerValues):
    noanswerSyntax = []
    noanswer = 'noanswer%s_%s'
    if noanswerLabels :
        for nt in noanswerLabels :
            navalname = noanswer%(qid,nt)
            na = "%s=0"%(navalname)
            noanswerSyntax.append(na)

    return noanswerSyntax

def sumSyntax(baseid,firstvar,lastvar) :
    amountchk = {
        'sumID': '%s_SUM'%(baseid),
        'syntax' : 'COMPUTE %s_SUM=SUM(%s TO %s).\n'%(baseid,firstvar,lastvar)
    }
    return amountchk

def selectUnique(qlabel,rowLabels,colLabels,option) :
    uniqueSyntax = ''
    dupchk = "!DUPCHK %s.\n"
    if option == 'cols' :
        uniqueList = []
        if colLabels :
            for c in colLabels :
                for r in rowLabels :
                    saLabel = '%s%s%s'%(qlabel,r,c)
                    uniqueList.append(saLabel)

                setVars = '%s TO %s'%(uniqueList[0],uniqueList[-1])
                uniqueSyntax += dupchk%setVars
        else :
            for r in rowLabels :
                saLabel = '%s%s'%(qlabel,r)
                uniqueList.append(saLabel)

            setVars = '%s TO %s'%(uniqueList[0],uniqueList[-1])
            uniqueSyntax += dupchk%setVars

    if option == 'rows' :
        uniqueList = []
        if rowLabels :
            for r in rowLabels :
                for c in colLabels :
                    saLabel = '%s%s%s'%(qlabel,r,c)
                    uniqueList.append(saLabel)

                setVars = '%s TO %s'%(uniqueList[0],uniqueList[-1])
                uniqueSyntax += dupchk%setVars
        else :
            for c in colLabels :
                saLabel = '%s%s'%(qlabel,c)
                uniqueList.append(saLabel)

            setVars = '%s TO %s'%(uniqueList[0],uniqueList[-1])
            uniqueSyntax += dupchk%setVars


    return uniqueSyntax


class makeSyntaxCommand(sublime_plugin.TextCommand) :
    def run (self,edit):
        try:
            sels = self.view.sel()
            
            for sel in sels :
                ss = self.view.substr(sel)
                s = ss.split('\n')
                s = [i for i in s if not i.strip() == ""]
                qidArr = []

                allType = ["radio","checkbox","number","float","text","textarea","select","block"]

                startQtype = ["<%s"%t for t in allType]
                endQtype = ["</%s>"%t for t in allType]

                safreq = "!SAFREQ %s.\n"
                mafreq = "!MAFREQ %s.\n"
                dupchk = "!DUPCHK %s.\n"
                temps = "TEMP.\n"
                textchk = "FREQ %s.\n"

                qAttr = {}
                defineDict = {}

                syntax = '* !!! Check please variable is set to survey order !!!.'

                for (ix,tx) in enumerate(s) :
                    #define list 
                    if '<define' in tx.strip() :
                        starts = s[ix:]
                        endTag = "</define>"
                        qText = ""
                        for st in starts :
                            if endTag in st.strip() :
                                qText += "%s\n"%st.strip()
                                break
                            else :
                                qText += "%s\n"%st.strip()

                        lines = qText.split('\n')
                        defineLabel = getElementOptions(lines[0].strip())['label']
                        defineRowsLabel = [getElementOptions(l.strip())['label'].upper() for l in lines if '<row' in l.strip()]
                        defineRowsValue = [int(getElementOptions(l.strip())['value'].upper()) for l in lines if '<row' in l.strip() and 'value' in l.strip()]

                        defineDict[defineLabel]=[defineRowsLabel,defineRowsValue]

                    if '<block' in tx.strip() :
                        starts = s[ix:]
                        endTag = "</block>"
                        qText = ""
                        for st in starts :
                            if endTag in st.strip() :
                                qText += "%s\n"%st.strip()
                                break
                            else :
                                qText += "%s\n"%st.strip()

                        lines = qText.split('\n')
                        blockLabel = getElementOptions(lines[0].strip())['label']
                        
                        syntax +='\n*_______ Block = %s _______.'%(blockLabel)

                    if '<image' in tx.strip() :
                        starts = s[ix:]
                        endTag = "</image>"
                        qText = ""
                        for st in starts :
                            if endTag in st.strip() :
                                qText += "%s\n"%st.strip()
                                break
                            else :
                                qText += "%s\n"%st.strip()

                        lines = qText.split('\n')
                        imgLabel = getElementOptions(lines[0].strip())['label']
                        
                        syntax += '\n*%s is Image Uploader.\n'%(imgLabel)
                        syntax += temps

                        noanswerLabels = makeElements(lines,defineDict)['noanswerLabels']
                        noanswerValues = makeElements(lines,defineDict)['noanswerValues']

                        noanswerSyntax = returnNoanswer(qlabel,noanswerLabels,noanswerValues)

                        if noanswerSyntax :
                            syntax += 'SEL IF (%s).\n'%(' AND '.join(noanswerSyntax))

                        syntax += textchk%(imgLabel)

                    if tx.strip() in startQtype :
                        syntax += '\n'
                        starts = s[ix:]
                        stype = starts[0].replace("<","").strip()
                        endTag = "</%s>"%(stype)
                        qText = ""
                        labelText = ""
                        for st in starts :
                            if st.strip() == endTag :
                                qText += endTag
                                break
                            else :
                                qText += "%s\n"%st.strip()

                        options = getOtions(qText)
                        lines = qText.split('\n')
                        qlabel = options['label'].upper()

                        print(qlabel)
                        rowLabels = makeElements(lines,defineDict)['rowLabels']
                        rowValues = makeElements(lines,defineDict)['rowValues']
                        colLabels = makeElements(lines,defineDict)['colLabels']
                        colValues = makeElements(lines,defineDict)['colValues']
                        choiceLabels = makeElements(lines,defineDict)['choiceLabels']
                        choiceValues = makeElements(lines,defineDict)['choiceValues']
                        noanswerLabels = makeElements(lines,defineDict)['noanswerLabels']
                        noanswerValues = makeElements(lines,defineDict)['noanswerValues']

                        if 'where' in options and 'execute' in options['where'] :
                            syntax += '*%s is Hidden Question.\n'%(qlabel)

                        if 'onLoad' in qText and 'copy(' in qText :
                            for l in lines :
                                if 'onLoad' in l.strip() :
                                    copyText = l.strip().replace('"','').replace("'",'').replace('<','').replace('>','')
                                    copyText = copyText[copyText.find("(")+1:copyText.find(")")].replace(" ","")
                                    copyText = copyText.split(',')

                                    copyDict = {'qid':copyText[0]}
                                    for cp in copyText :
                                        if '=' in cp :
                                            copyDict[cp.split('=')[0]] = cp.split('=')[1]

                                    if 'rows' in copyDict :
                                        if copyDict['rows'] == 'True' :
                                            rowLabels = qAttr[copyDict['qid']]['rows'][0].copy()
                                            rowValues = qAttr[copyDict['qid']]['rows'][1].copy()

                                    if 'cols' in copyDict :
                                        if copyDict['cols'] == 'True' :
                                            colLabels = qAttr[copyDict['qid']]['cols'][0].copy()
                                            colValues = qAttr[copyDict['qid']]['cols'][1].copy()

                                    if 'choices' in copyDict :
                                        if copyDict['choices'] == 'True' :
                                            choicesLabels = qAttr[copyDict['qid']]['choices'][0].copy()
                                            choicesValues = qAttr[copyDict['qid']]['choices'][1].copy()

                        

                        qAttr[qlabel] = {
                            'index': ix,
                            'type' : stype,
                            'rows' : [rowLabels,rowValues],
                            'cols' : [colLabels,colValues],
                            'choices' : [choiceLabels,choiceValues],
                            'noanswer' : [noanswerLabels,noanswerValues]
                        }
                        
                        noanswerSyntax = returnNoanswer(qlabel,noanswerLabels,noanswerValues)

                        #radio (SA)
                        if stype == 'radio' :
                            #grouping cols 
                            if 'grouping' in options :
                                if options['grouping'] == 'cols' :
                                    for c in colLabels :
                                        cLabel = '%s%s'%(qlabel,c)

                                        if noanswerSyntax :
                                            cLabel = '%s / (%s)'%(cLabel,' AND '.join(noanswerSyntax))

                                        syntax += safreq%(cLabel)

                                    #rank col
                                    if 'unique' in options :
                                        toText = '%s TO %s'%('%s%s'%(qlabel,colLabels[0]),'%s%s'%(qlabel,colLabels[-1]))
                                        syntax += dupchk%(toText)
                            
                            #grid
                            elif rowLabels and colLabels :
                                for r in rowLabels :
                                    rLabel = '%s%s'%(qlabel,r)

                                    if noanswerSyntax :
                                        rLabel = '%s / (%s)'%(rLabel,' AND '.join(noanswerSyntax))

                                    syntax += safreq%(rLabel)

                            #defalut SA
                            else :
                                saLabel = qlabel

                                if noanswerSyntax :
                                    saLabel = '%s / (%s)'%(saLabel,' AND '.join(noanswerSyntax))

                                syntax += safreq%(saLabel)

                        #checkbox 
                        if stype == 'checkbox' :
                            #row and col
                            if rowLabels and colLabels :
                                if 'grouping' in options and options['grouping'] == 'cols':
                                        for c in colLabels :
                                            firstLabel = "%s%s%s"%(qlabel,rowLabels[0],c)
                                            lastLabel = "%s%s%s"%(qlabel,rowLabels[-1],c)
                                            toCode = '%s THRU %s'%(min(rowValues),max(rowValues)) if rowValues else '1'
                                            toText = '%s TO %s (%s)'%(firstLabel,lastLabel,toCode)

                                            if noanswerSyntax :
                                                toText = '%s / (%s)'%(toText,' AND '.join(noanswerSyntax))

                                            syntax += mafreq%(toText)
                                else :
                                    for r in rowLabels :
                                        firstLabel = "%s%s%s"%(qlabel,r,colLabels[0])
                                        lastLabel = "%s%s%s"%(qlabel,r,colLabels[-1])
                                        toCode = '%s THRU %s'%(min(colValues),max(colValues)) if colValues else '1'
                                        toText = '%s TO %s (%s)'%(firstLabel,lastLabel,toCode)

                                        if noanswerSyntax :
                                            toText = '%s / (%s)'%(toText,' AND '.join(noanswerSyntax))

                                        syntax += mafreq%(toText)

                            #only row
                            elif rowLabels and not colLabels :
                                firstLabel = "%s%s"%(qlabel,rowLabels[0])
                                lastLabel = "%s%s"%(qlabel,rowLabels[-1])
                                toCode = '%s THRU %s'%(min(rowValues),max(rowValues)) if rowValues else '1'
                                toText = '%s TO %s (%s)'%(firstLabel,lastLabel,toCode)

                                if noanswerSyntax :
                                    toText = '%s / (%s)'%(toText,' AND '.join(noanswerSyntax))

                                syntax += mafreq%(toText)

                            #only col
                            elif not rowLabels and colLabels :
                                firstLabel = "%s%s"%(qlabel,colLabels[0])
                                lastLabel = "%s%s"%(qlabel,colLabels[-1])
                                toCode = '%s THRU %s'%(min(colValues),max(colValues)) if colValues else '1'
                                toText = '%s TO %s (%s)'%(firstLabel,lastLabel,toCode)

                                if noanswerSyntax :
                                    toText = '%s / (%s)'%(toText,' AND '.join(noanswerSyntax))

                                syntax += mafreq%(toText)

                        #number or float
                        if stype in ['number','float']:
                            rangeSyntax = ''
                            amountchk = ''
                            if 'verify' in options :
                                #range(,)
                                if 'range' in options['verify'] : 
                                    verify = options['verify']
                                    rangeText = verify[verify.find('(')+1:verify.find(')')]
                                    rangeText = rangeText.split(',')
                                    minv = eval(rangeText[0])
                                    maxv = eval(rangeText[1])
                                    rangeSyntax = '(%s THRU %s)'%(minv,maxv)

                            #float range
                            if stype == 'float' :
                                if 'range=' in options :
                                    verify = options['range']
                                    rangeText = verify.split(',')
                                    minv = eval(rangeText[0])
                                    maxv = eval(rangeText[1])
                                    rangeSyntax = '(%s THRU %s)'%(minv,maxv)


                            if 'amount' in options :
                                amountchk = options['amount']

                            defalutRange = rangeSyntax
                            defalutAmount = amountchk

                            #row and col
                            if rowLabels and colLabels :
                                if 'grouping' in options and options['grouping'] == 'cols':
                                    for c in colLabels :
                                        rangeSyntax = defalutRange
                                        amountchk = defalutAmount
                                                
                                        for r in rowLabels :
                                            nLabel = '%s%s%s%s'%(qlabel,r,c,rangeSyntax)

                                            if noanswerSyntax :
                                                nLabel = '%s / (%s)'%(nLabel,' AND '.join(noanswerSyntax))

                                            syntax += safreq%(nLabel)

                                        if not amountchk == '' :
                                            baseid = '%s%s'%(qlabel,c)
                                            firstvar = '%s%s%s'%(qlabel,c,rowLabels[0])
                                            lastvar = '%s%s%s'%(qlabel,c,rowLabels[-1])
                                            sumsyntax = sumSyntax(baseid,firstvar,lastvar)
                                            syntax+=sumsyntax['syntax']
                                            syntax+='EXECUTE.\n'
                                            sumchk = '%s(%s)'%(sumsyntax['sumID'],amountchk)
                                            syntax+=safreq%(sumchk)
                                            syntax+='\n'

                                else :
                                    for r in rowLabels :
                                        rangeSyntax = defalutRange
                                        amountchk = defalutAmount

                                        for c in colLabels :
                                            nLabel = '%s%s%s%s'%(qlabel,r,c,rangeSyntax)

                                            if noanswerSyntax :
                                                nLabel = '%s / (%s)'%(nLabel,' AND '.join(noanswerSyntax))

                                            syntax += safreq%(nLabel)

                                        if not amountchk == '' :
                                            baseid = '%s%s'%(qlabel,r)
                                            firstvar = '%s%s%s'%(qlabel,r,colLabels[0])
                                            lastvar = '%s%s%s'%(qlabel,r,colLabels[-1])
                                            sumsyntax = sumSyntax(baseid,firstvar,lastvar)
                                            syntax+=sumsyntax['syntax']
                                            syntax+='EXECUTE.\n'
                                            sumchk = '%s(%s)'%(sumsyntax['sumID'],amountchk)
                                            syntax+=safreq%(sumchk)
                                            syntax+='\n'
                            #row number
                            elif rowLabels and not colLabels :
                                for r in rowLabels :
                                    rqid = '%s%s'%(qlabel,r)
                                    rangeSyntax = defalutRange
                                    amountchk = defalutAmount


                                    nLabel = "%s%s"%(rqid,rangeSyntax)

                                    if noanswerSyntax :
                                        nLabel = '%s / (%s)'%(nLabel,' AND '.join(noanswerSyntax))

                                        syntax += safreq%(nLabel)
                                    else :
                                        syntax += safreq%(nLabel)

                                if not amountchk == '' :
                                    baseid = '%s'%(qlabel)
                                    firstvar = '%s%s'%(qlabel,rowLabels[0])
                                    lastvar = '%s%s'%(qlabel,rowLabels[-1])
                                    sumsyntax = sumSyntax(baseid,firstvar,lastvar)
                                    syntax+=sumsyntax['syntax']
                                    syntax+='EXECUTE.\n'
                                    sumchk = '%s(%s)'%(sumsyntax['sumID'],amountchk)
                                    syntax+=safreq%(sumchk)
                                    syntax+='\n'


                            #col number
                            elif not rowLabels and colLabels :
                                for c in colLabels :
                                    rqid = '%s%s'%(qlabel,c)
                                    rangeSyntax = defalutRange
                                    amountchk = defalutAmount


                                    nLabel = "%s%s"%(rqid,rangeSyntax)

                                    if noanswerSyntax :
                                        nLabel = '%s / (%s)'%(nLabel,' AND '.join(noanswerSyntax))

                                        syntax += safreq%(nLabel)
                                    else :
                                        syntax += safreq%(nLabel)

                                if not amountchk == '' :
                                    baseid = '%s'%(qlabel)
                                    firstvar = '%s%s'%(qlabel,colLabels[0])
                                    lastvar = '%s%s'%(qlabel,colLabels[-1])
                                    sumsyntax = sumSyntax(baseid,firstvar,lastvar)
                                    syntax+=sumsyntax['syntax']
                                    syntax+='EXECUTE.\n'
                                    sumchk = '%s(%s)'%(sumsyntax['sumID'],amountchk)
                                    syntax+=safreq%(sumchk)
                                    syntax+='\n'

                            #defalut number
                            else :
                                nLabel = "%s%s"%(qlabel,rangeSyntax)

                                if noanswerSyntax :
                                    nLabel = '%s / (%s)'%(nLabel,' AND '.join(noanswerSyntax))

                                syntax += safreq%(nLabel)

                        #select
                        if stype == 'select' :
                            #ranksort (only rows)
                            if 'uses' in options and 'ranksort' in options['uses'] :
                                minv = 1
                                maxv = len(choiceLabels)
                                
                                if choiceValues :
                                    minv = min(choiceValues)
                                    maxv = max(choiceValues)

                                firstLabel = "%s%s"%(qlabel,rowLabels[0])
                                lastLabel = "%s%s"%(qlabel,rowLabels[-1])
                                toCode = '%s THRU %s'%(minv,maxv)
                                toText = '%s TO %s (%s)'%(firstLabel,lastLabel,toCode)

                                syntax += mafreq%(toText)

                            elif rowLabels and colLabels :
                                if 'grouping' in options and options['grouping'] == 'cols':
                                    for c in colLabels :
                                        for r in rowLabels :
                                            saLabel = '%s%s%s'%(qlabel,r,c)

                                            if noanswerSyntax :
                                                saLabel = '%s / (%s)'%(saLabel,' AND '.join(noanswerSyntax))

                                            syntax += safreq%(saLabel)
                                else :
                                    for r in rowLabels :
                                        for c in colLabels :
                                            saLabel = '%s%s%s'%(qlabel,r,c)

                                            if noanswerSyntax :
                                                saLabel = '%s / (%s)'%(saLabel,' AND '.join(noanswerSyntax))
                                                
                                            syntax += safreq%(saLabel)

                            #row select
                            elif rowLabels and not colLabels :
                                for r in rowLabels :
                                    saLabel = '%s%s'%(qlabel,r)

                                    if noanswerSyntax :
                                        saLabel = '%s / (%s)'%(saLabel,' AND '.join(noanswerSyntax))
                                        
                                    syntax += safreq%(saLabel)

                            #col select
                            elif not rowLabels and colLabels :
                                for c in colLabels :
                                    saLabel = '%s%s'%(qlabel,c)

                                    if noanswerSyntax :
                                        saLabel = '%s / (%s)'%(saLabel,' AND '.join(noanswerSyntax))
                                        
                                    syntax += safreq%(saLabel)

                            #defalut select
                            else :
                                saLabel = qlabel

                                if noanswerSyntax :
                                    saLabel = '%s / (%s)'%(saLabel,' AND '.join(noanswerSyntax))

                                syntax += safreq%(saLabel)

                            if 'unique' in options :
                                selectOption = options['unique'].split(',')
                                if 'none' in selectOption :
                                    selectOption.remove('none')

                                for o in selectOption :
                                    syntax += selectUnique(qlabel,rowLabels,colLabels,o)
                                if len(selectOption) >=2 :
                                    syntax += '*(Select duplicate : 2 option in unique) Please fix it and use it.\n'

                        #text or textarea
                        if stype in ['text','textarea']:
                            textList = []

                            if 'uses' in options and 'videoplayer' in options['uses'] :
                                syntax += '*%s is videoplayer.\n'%(qlabel)
                            else :
                                if stype in ['text','textarea'] :
                                    syntax += '*%s is OE.\n%s'%(qlabel,temps)
                                elif stype in ['image'] :
                                    syntax += '*%s is image uploader.\n%s'%(qlabel,temps)

                                if rowLabels and colLabels :
                                    if 'grouping' in options and options['grouping'] == 'cols':
                                        for c in colLabels :
                                            textList = []
                                            for r in rowLabels :
                                                setLabel = '%s%s%s'%(qlabel,r,c)
                                                textList.append(setLabel)

                                            txLabel = '%s TO %s'%(textList[0],textList[-1]) if len(textList) >=2 else textList[0]

                                            if noanswerSyntax :
                                                syntax += 'SEL IF (%s).\n'%(' AND '.join(noanswerSyntax))

                                            syntax += textchk%(txLabel)
                                    else :
                                        for r in rowLabels :
                                            textList = []
                                            for c in colLabels :
                                                setLabel = '%s%s%s'%(qlabel,r,c)
                                                textList.append(setLabel)

                                            txLabel = '%s TO %s'%(textList[0],textList[-1]) if len(textList) >=2 else textList[0]

                                            if noanswerSyntax :
                                                syntax += 'SEL IF (%s).\n'%(' AND '.join(noanswerSyntax))

                                            syntax += textchk%(txLabel)

                                #row text
                                elif rowLabels and not colLabels :
                                    textList = []
                                    for r in rowLabels :
                                        setLabel = '%s%s'%(qlabel,r)
                                        textList.append(setLabel)

                                    txLabel = '%s TO %s'%(textList[0],textList[-1]) if len(textList) >=2 else textList[0]

                                    if noanswerSyntax :
                                        syntax += 'SEL IF (%s).\n'%(' AND '.join(noanswerSyntax))

                                    syntax += textchk%(txLabel)

                                #col text
                                elif not rowLabels and colLabels :
                                    textList = []
                                    for c in colLabels :
                                        setLabel = '%s%s'%(qlabel,c)
                                        textList.append(setLabel)

                                    txLabel = '%s TO %s'%(textList[0],textList[-1]) if len(textList) >=2 else textList[0]

                                    if noanswerSyntax :
                                        syntax += 'SEL IF (%s).\n'%(' AND '.join(noanswerSyntax))

                                    syntax += textchk%(txLabel)

                                #defalut text
                                else :
                                    txLabel = qlabel

                                    if noanswerSyntax :
                                        syntax += 'SEL IF (%s).\n'%(' AND '.join(noanswerSyntax))

                                    syntax += textchk%(txLabel)

            #print syntax
            #print(syntax)
            self.view.replace(edit,sel, syntax)

        except Exception as e:
            print (e)



class makeQuotaCommand(sublime_plugin.TextCommand) :
    def run (self,edit):
        try:
            sels = self.view.sel()
            
            for sel in sels :
                s = self.view.substr(sel)
                s = s.split('\n')
                s = [i for i in s if not i.strip()=='']

                td = dict()

                for t in s :
                    st = t.split('\t')

                    for ix, v in enumerate(st) :
                        if not ix in td :
                            td[ix] = []

                        if not v.strip() == '' :
                            td[ix].append(v)

                sorttd = [arr for ix,arr in sorted(td.items()) ]
                sorttd = list(product(*sorttd))

                printPage = ''

                for ix, tx in enumerate(sorttd) :
                    arr = tx
                    if not ix == 0 :
                        arr = []
                        beforeArr = sorttd[ix-1]
                        for t in tx :
                            if t in beforeArr :
                                arr.append('')
                            else :
                                arr.append(t)

                    printPage += '%s\tinf\n'%('\t'.join(arr))
                    

                #print(printPage)
                
                self.view.replace(edit,sel, printPage)

        except Exception as e:
            print (e)




class makeDcmResCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)

                line_split = input.split("\n")
                line_split = [line for line in line_split if not line.strip() == ""]

                legend_cnt = 0
                legends = []
                levels = []

                for line in line_split :
                    sline = line.replace('\t',' ')
                    sline = sline.split(' ')
                    
                    if not sline[0].isdigit() :
                        # legend
                        legend_cnt += 1
                        legends.append((legend_cnt, line))
                        continue

                    if sline[0].isdigit() :
                        curr = (legend_cnt, int(sline[0]), ' '.join(sline[1:]).strip())
                        levels.append(curr)

                printPage += '<res label="NoneText">None</res>\n'
                printPage += '<res label="TopText">Concept</res>\n'
                printPage += '<res label="rowText">Select</res>\n'
                
                for legend in legends :
                    legend_code = legend[0]
                    legend_text = legend[1].replace("&", "&amp;")
                    printPage += f'<res label="DCM_legend{legend_code}">{legend_text}</res>\n'

                    curr_levels = [level for level in levels if level[0]==legend_code]

                    for level in curr_levels :
                        level_code = level[1]
                        level_text = level[2].replace("&", "&amp;")
                        printPage += f'<res label="DCM_att{legend_code}_level{level_code}">{level_text}</res>\n'
    
                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeMaxdiffResCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)

                line_split = input.split("\n")
                line_split = [line.replace('\t',' ').replace("&", "&amp;").split(' ') for line in line_split if not line.strip() == ""]

                for line in line_split :
                    attr_code = line[0]
                    attr_text = ' '.join(line[1:])
                    printPage += f'<res label="MD_item{attr_code}">{attr_text}</res>\n'
                
                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)


class loopLabelCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                set_text = ''
                if textr == '' :
                    set_text = 'L[loopvar: label]'
                else :
                    textr = self.view.substr(sels)
                    set_text = f'[loopvar: {textr}]'
                self.view.replace(edit,sels, set_text)
                
            except Exception as e:
                print (e) 


class entityCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                textr = html.escape(textr)
                textr = textr.replace('[', '〔')
                textr = textr.replace(']', '〕')
                self.view.replace(edit,sels, textr)
                
            except Exception as e:
                print (e) 

