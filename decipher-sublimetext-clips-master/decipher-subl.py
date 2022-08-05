import sublime, sublime_plugin,re

#define survey context
def returnContext(self):
    returnString = self.view.find('surveyType=(.*)',0)
    if returnString:
        returnString = self.view.substr(returnString)
        return returnString[11:14]
    else:
        return ' '
# returns array [input, label,title]
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

def tidySurveyInput(input):
    input = re.sub("\t+", " ", input)
    input = re.sub("\n +\n", "\n\n", input)
    funkyChars = [(chr(133),'...'),(chr(145),"'"),(chr(146),"'"),(chr(147),'"'),(chr(148),'"'),(chr(151),'--')]
    for pair in funkyChars:
        input = input.replace(pair[0],pair[1])
    input = re.sub("\n{3,}", "\n\n", input)
    input = input.replace("&", "&amp;")
    input = input.replace("&amp;#", "&#")
    return input

# normal survey return array header & footer
def newSurvey():
    HEADER = """<?xml version="1.0" encoding="UTF-8"?>
<survey 
  alt=""
  autosave="0"
  builder:wizardCompleted="1"
  builderCompatible="1"
  compat="150"
  delphi="1"
  secure="1"
  fir="on"
  displayOnError="all"
  extraVariables="source,record,decLang,list,userAgent"
  html:showNumber="0"
  lang="korean"
  markerTimeout="0"
  mobile="compat"
  mobileDevices="smartphone,tablet,desktop"
  name="Survey"
  persistentExit="1"
  setup="term,decLang,quota,time"
  ss:disableBackButton="1"
  ss:enableNavigation="1"
  ss:hideProgressBar="0"
  ss:logoAlt="Nielsen Consumer LLC"
  ss:includeCSS="/survey/selfserve/nielseniq.css"
  ss:logoFile="selfserve/nielseniq.png"
  ss:logoPosition="left"
  theme="company/nielseniq-new"
  state="testing">

<res label="chk_plz">응답 확인 부탁드립니다.</res>
<res label="samegrid">모든 항목에 대해 동일한 답변을 입력했습니다.</res>
<res label="softerr">응답을 다시 한번 확인해 주세요. 응답이 맞을 경우, 다음버튼을 누르고 진행을 하시면 됩니다.</res>
<res label="err2010">하나 이상의 답변을 입력하십시오.</res>
<res label="err2011">동일한 답변을 입력하지 마십시오.</res>
<res label="err2012">첫 번째 텍스트 입력란부터 순서대로 입력하십시오.</res>
<res label="err2050">중복 입력하지 마십시오.</res>
<res label="badhan">ㄱ,ㄲ,ㄴ,ㄷ,ㄸ,ㄹ,ㅁ,ㅂ,ㅃ,ㅅ,ㅆ,ㅇ,ㅈ,ㅉ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ,ㅏ,ㅐ,ㅑ,ㅒ,ㅓ,ㅔ,ㅕ,ㅖ,ㅗ,ㅘ,ㅙ,ㅚ,ㅛ,ㅜ,ㅝ,ㅞ,ㅟ,ㅠ,ㅡ,ㅢ,ㅣ,ㄵ,ㄶ,ㄺ,ㄻ,ㄼ,ㄽ,ㄾ,ㄿ,ㅀ,ㅄ</res>
<res label="badhan_err">입력 확인 부탁 드립니다.</res>
<res label="badspa">@,$,%,#,*,!,?</res>
<res label="badspa_err">특수 문자는 입력하실 수 없습니다.</res>

<samplesources default="0">
  <samplesource list="0">
    <title>Open Survey</title>
    <completed>It seems you have already entered this survey.</completed>
    <exit cond="terminated"><span class="bold">본 조사에 참여해주셔서 감사합니다.</span><br /><br />본격적으로 조사를 시작하기 전에, 귀하가 본 조사에 적합한 응답 대상인지 알아보기 위해 몇 가지의 질문을 드렸습니다.<br /><br />죄송합니다. 귀하께서는 본 조사의 응답 대상이 아니십니다.<br /><br />차후에 다른 온라인 조사에 참여해주시면 감사하겠습니다.<br /><br />귀하의 소중한 의견은 더 나은 제품과 서비스를 개발하는데 좋은 정보가 될 것입니다.</exit>
    <exit cond="qualified"><span class="bold">이로써 설문이 완료되었습니다. </span><br /><br /><span class="bold">귀한 시간 내주셔서 대단히 감사드립니다.</span></exit>
    <exit cond="overquota"><span class="boldblue">본 조사에 참여해 주셔서 감사합니다. </span><br /><br />안타깝게도, 귀하께서 해당하시는 조사 대상 그룹의 조사는 이미 종료되었습니다.<br /><br />다음에 참여해 주시기 바랍니다.</exit>
  </samplesource>

  <samplesource list="1">
    <title>Tillion</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="sid" required="1"/>
    <var name="eid" unique="1"/>
    <exit cond="terminated" url="http://out.pmirnc.com/?sid=${sid}&amp;eid=${eid}&amp;st=S&amp;stdt=SO1"/>
    <exit cond="overquota" url="http://out.pmirnc.com/?sid=${sid}&amp;eid=${eid}&amp;st=Q&amp;stdt=QO"/>
    <exit cond="qualified" url="http://out.pmirnc.com/?sid=${sid}&amp;eid=${eid}&amp;st=C&amp;stdt=CO1"/>
  </samplesource>

  <samplesource list="2">
    <title>Toluna</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="GID" unique="1"/>
    <var name="sname" required="1"/>
    <exit cond="terminated" url="http://ups.surveyrouter.com/trafficui/mscui/SOTerminated.aspx?sname=${sname}&amp;TolunaEnc=${HQTolunaEnc.val}&amp;GID=${GID}"/>
    <exit cond="overquota" url="http://ups.surveyrouter.com/trafficui/mscui/SOQuotafull.aspx?sname=${sname}&amp;TolunaEnc=${HQTolunaEnc.val}&amp;GID=${GID}"/>
    <exit cond="qualified" url="http://ups.surveyrouter.com/trafficui/mscui/SOQualified.aspx?sname=${sname}&amp;TolunaEnc=${HQTolunaEnc.val}&amp;GID=${GID}"/>
  </samplesource>

  <samplesource list="9">
    <title>UserIdSampleSource</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="UID" unique="1"/>
    <exit cond="terminated"><span class="bold">본 조사에 참여해주셔서 감사합니다.</span><br /><br />본격적으로 조사를 시작하기 전에, 귀하가 본 조사에 적합한 응답 대상인지 알아보기 위해 몇 가지의 질문을 드렸습니다.<br /><br />죄송합니다. 귀하께서는 본 조사의 응답 대상이 아니십니다.<br /><br />차후에 다른 온라인 조사에 참여해주시면 감사하겠습니다.<br /><br />귀하의 소중한 의견은 더 나은 제품과 서비스를 개발하는데 좋은 정보가 될 것입니다.</exit>
    <exit cond="qualified"><span class="bold">이로써 설문이 완료되었습니다. </span><br /><br /><span class="bold">귀한 시간 내주셔서 대단히 감사드립니다.</span></exit>
    <exit cond="overquota"><span class="boldblue">본 조사에 참여해 주셔서 감사합니다. </span><br /><br />안타깝게도, 귀하께서 해당하시는 조사 대상 그룹의 조사는 이미 종료되었습니다.<br /><br />다음에 참여해 주시기 바랍니다.</exit>
  </samplesource>

</samplesources>

<suspend/>

<style name="respview.client.css"><![CDATA[
<style>
body { word-break: keep-all; }
.hidden{display: none !important;}
.sq-cardsort-bucket-count{display: none !important;}
.hangle{color:red;border:0;text-align:right;width:200px; }
</style>
]]></style>
<style name="respview.client.js"><![CDATA[
<script>
$ (document).ready(function(){
  $ (".autosave-restart").hide();

  $ (document).change(function(){
    for(var i=1; i<=10; i++){
      var base = '.rank'+i+'.exclusive';
      var auto_cnt = i+1;
      var auto = '.rank'+auto_cnt+'.exclusive';
      if( $ (base).find('input[type=radio]').is(':checked') ){
        $ (auto).find('input[type=radio]').prop('checked',true);
        $ ('.rank'+i).find('.fir-icon.selected').attr('class','fir-icon');
        $ (base).find('.fir-icon').attr('class','fir-icon selected');
      }
    }
  });
});

function range(start, end) {
  let array = [];
  for (let i = start; i < end; ++i) {
    array.push(i);
  }
  return array;
}


function viewKorean(num,dan){
  string=num;
  hn = new Array("영","일","이","삼","사","오","육","칠","팔","구");
  hj = new Array("원","만","억","조","경","해","시","양","구","간","정","재","극","항하사","아승지","나유타","불가사의","무량대수");
  ul = new Array("영천","영백","영십","영");
  tm = new Array();
  result = "";
  string = string + dan;  // 금액 단위
  if (string.charAt(0)=="-"){ result = "마이너스 "; string = string.substr(1,string.length-1); }
  loop_size = Math.ceil(string.length/4);
           string2 = "";
  for (count=string.length; count >= 0; count--)
      string2 += string.substring(count,count-1);
           string = string2;
  for (A=0;A<loop_size;A++)
  {
    sum = hj[A] + " ";
    tm[A] = string.substr(A*4,4);
    tm2 = "";
    for (count=tm[A].length; count >= 0; count--)
        tm2 += tm[A].substring(count,count-1);
        tm[A] = tm2;
        part_jari = tm[A].length;
        for (D=0;D<10;D++){
          for (B=0;B<10;B++) tm[A] = tm[A].replace(B,hn[B]);
        }
    if (part_jari == 4) tm[A] = tm[A].charAt(0)+"천"+tm[A].charAt(1)+"백"+tm[A].charAt(2)+"십"+tm[A].charAt(3);
    else if (part_jari == 3) tm[A] = tm[A].charAt(0)+"백"+tm[A].charAt(1)+"십"+tm[A].charAt(2);
    else if (part_jari == 2) tm[A] = tm[A].charAt(0)+"십"+tm[A].charAt(1);
    else tm[A] = tm[A].charAt(0);
    for (C=0;C<4;C++)
    {
     if (tm[A].match(ul[C])){ part_jari--; tm[A] = tm[A].replace(ul[C],""); }
    }
    if (part_jari != 0) tm[A] += sum;
  }
  for (loop_size;loop_size>-1;loop_size--) result += tm[loop_size];
    result = result.replace("undefined","")
    return result;
}

function han(d){
  var arr=$ ('.hanchange');

  for(var i=0; i<arr.length; i++){
    var current_value = arr.eq(i).find('input[type=text]').val();
    var dan=d; // 단위
    
    var han_num=viewKorean(current_value,dan);

    arr.eq(i).find('.hangle').html(han_num);
  }

  $ ('.hanchange').find('input[type=text]').keyup(function () {
        $ (this).val($ (this).val().replace(/[^0-9]/g,""));
    var current_value=$ (this).val();
    var dan=d; // 단위
    
    var han_num=viewKorean(current_value,dan);
    $ ("span[name^='hangle_"+$ (this).attr('name')+"']").html(han_num);
  });
}
</script>
]]></style>
<suspend/>

<style label="hideElements" name="question.element"><![CDATA[
\@if ec.simpleList
<div class="element $(rowStyle) $(levels) $(extraClasses) ${col.group.styles.ss.groupClassNames if col.group else (row.group.styles.ss.groupClassNames if row.group else "")} $(col.styles.ss.colClassNames) $(row.styles.ss.rowClassNames) ${"clickableCell" if isClickable else ""}"$(extra)>
    ${v2_insertStyle('el.label.start')}
    ${v2_insertStyle('el.label.end')}
</div>
\@else
<$(tag) $(headers) class="cell nonempty element $(levels) ${"desktop" if this.grouping.cols else "mobile"} border-collapse $(extraClasses) ${col.group.styles.ss.groupClassNames if col.group else (row.group.styles.ss.groupClassNames if row.group else "")} $(col.styles.ss.colClassNames) $(row.styles.ss.rowClassNames) ${"clickableCell" if isClickable else ""}"$(extra)>
    ${v2_insertStyle('el.label.start')}
    ${v2_insertStyle('el.label.end')}
</$(tag)>
\@endif
]]></style>
<suspend/>

<exec when="init">
survey_path = gv.survey.path.split("/")[-1]
# Adhoc = AD / Tracking = TRC
imgdr = "https://nielsenkor.cafe24.com/Decipher/AD/{}/".format(survey_path)

from datetime import datetime
import random

def status(condt,label):
    if condt : 
      RespStatus.val=getattr(RespStatus,"{}".format(label)).index

def dat(filename,baseid,basecode) :
  datfile=File(filename,baseid)
  if datfile:
    data_dict=datfile.get(basecode)
    return data_dict

def datToDict(filename,baseid,basecode) :
  dat_dict={}

  try :
    dats = dat(filename,baseid,basecode)
    dat_dict[baseid] = basecode
    if dats:
      for n,v in dat(filename,baseid,basecode).items() :
        dat_dict[n]=v
      return dat_dict
  except :
    return None

def soft_Err(cond, str):
  if cond :
    if p.chk==0 :
      p.chk=1
    else :
      p.chk=0
      error(str)
  else :
    p.chk=1

def samegrid():
  qid = allQuestions[this.label]
  checkAnswer = [i.label for i in qid.rows if not i.val == None]
  if len(checkAnswer) gt 1 :
    if len(set(qid.val)-set([None])) == 1:
      soft_Err("%s<br/>%s"%(res.samegrid, res.softerr))
    else :
      p.chk=1
  else :
    p.chk=1

def rankCnt(multiBase,maxRank):
  cnt = maxRank
  if not multiBase.count ge maxRank :
    cnt = multiBase.count
  return cnt


# dupchk open list
def checkOpen():
  str_1=res.err2010
  str_2=res.err2011
  str_3=res.err2012

  set_list=[]
  
  vals=[i.val for i in this.rows if not i.val == None]
  for s in vals:
    if s != "" :
      flag=True
      set_list.append(s.upper())


  if not set_list :
    error(str_1)
  else :
    for j in range(0,len(set_list)-1):
        preval=this.rows[j].val
        st=j+1
        for i in range(st,len(set_list)):
            postval=this.rows[i].val
            if preval != "" and postval != "" :
              if preval==postval:
                  error(str_2)

    for k in range(0,len(set_list)):
      if this.rows[k].val=="":
        error(str_3)



# TMO Error
def checkDuplicates(Qid) :
  # before Q
  Arr=[]
  
  # Curret Q
  Brr=[]
  
  # Label Array
  Crr=[]
  
  vls=allQuestions[Qid].values

  for i in vls:
    Arr.append(i.upper())
    Crr.append(i)

  for j in this.values:
    Brr.append(j.upper())


  if len(Arr) gt 0 and len(Brr) gt 0:
    if (Brr[0]!=""):
      for i in range(0,len(Brr)):
        preText=Brr[i]
        for j in range(0,len(Arr)):
          currentText=Arr[j]
          if preText!="" and currentText!="":
            if preText==currentText:
              errstr=Crr[j]+'-'+res.err2050
              error(errstr)
              break


def badtext() :
  tt=[i.replace(" ","") for i in this.values if not i==None]
  badhan=(res.badhan)
  badhan=badhan.split(',')

  badspa=(res.badspa)
  badspa=badspa.split(',')


  for i in range(0,len(tt)) :
    current_v=tt[i]
    current_len=len(current_v)
    for j in range(0,int(current_len),3) :
      fn=j
      ln=int(j)+3
      if current_v[fn:ln] in badhan :
        error(res.badhan_err)


  for i in range(0,len(tt)) :
    current_v=tt[i]
    current_len=len(current_v)
    for j in range(0,int(current_len),1) :
      if current_v[j] in badspa :
        error(res.badspa_err)

def group_rows(question, grouped_rows ):
    first_item_index = None

    shuffle_order = [row.index for row in question.rows.order]

    for index, row in enumerate( shuffle_order ):
        if question.rows[row].label in grouped_rows:
            if first_item_index == None:
                first_item_index = index
            else:
                # As we continue iterating through the shuffle order
                # each time we reach a row that is in the set of
                # rows to be grouped together, increment our index
                # value and move this row into the new position
                first_item_index += 1
                shuffle_order.insert( first_item_index, shuffle_order.pop(index) )

    question.rows.order = shuffle_order

def disabled_labels(question, condition, labels=[]) :
  if condition :
    for label in labels :
      question.attr(label).disabled = True
  else :
    for label in labels :
      question.attr(label).disabled = False
      


def quota_control(quota_sheet, unfied_define_label="R" ,defines=[]) :
    # exmaple
    # quota_sheet : "/HQ15_Quotas"
    # unfied_define_label = "HQ15R" | "Q1R" 
    # defines : It's a list  | [1, 2, 3]
    # unfied_define_label="", defines=["male", "female"]

    try :
        quotas = gv.survey.root.quota.getQuotaCells()

        cells = {}
        for define in defines :
            quota_cell = "%s/%s%s"%(quota_sheet, unfied_define_label, define)
            cells[define] = quota_cell

        if cells :
            print(cells)
            # check quota cell limit or Overquota
            checked_cells = {}
            for define, cell in cells.items() :
                current, limit, overquota = quotas[cell]

                if limit == 0 :
                    continue
                elif current ge limit :
                    continue
                else :
                    checked_cells[define] = {"cell" : cell, "current": current, "limit": limit, "overquota": overquota}

            if checked_cells :
                print(checked_cells)

                keys = checked_cells.keys()
                keys_len = len(keys)

                if keys_len gt 1 :
                    current_by_key = [(key, value["cell"], value["current"]) for key, value in checked_cells.items()]
                    currents = [k[2] for k in current_by_key]

                    min_current = min(currents)

                    final_cells = [k for k in current_by_key if k[2] == min_current]

                    print(final_cells)

                    fc_len = len(final_cells)
                    return_value = None

                    if fc_len gt 1 :
                        print("Random Assignment Among Insufficient Cells")
                        random_cell = random.choice(final_cells)
                        return_value = random_cell[0]

                    else :
                        print("Assign to Insufficient Cells")
                        return_value = final_cells[0][0]

                    if not return_value == None :
                        print("Cell : %s / define : %s"%( checked_cells[return_value]["cell"], return_value ))
                        return return_value
                    else :
                        print("return_value is identified")
                        return None

                else :
                    return_value = keys[0]
                    print("One cell is identified")
                    print("Cell : %s / define : %s"%( checked_cells[return_value]["cell"], return_value ))
                    return return_value

            else :
                print("!!! checked_cells is not verified !!!")
                return None

        else :
            print("!!! cells is empty !!!")
            return None
    except :
        print("!!! An error has occurred !!!")
        return None
</exec>

<suspend/>

<exec>
p.chk = 1
</exec>

<suspend/>

<style cond="1" name="survey.respview.footer.support"><![CDATA[
Copyright &#9400; ${time.strftime('%Y')} Nielsen Consumer LLC. All Rights Reserved. <a href="@(PrivacyPolicyUrl)" target="_blank" rel="noopener">@(PrivacyPolicy)</a>.
]]></style>
<exec sst="0">
if list=="2":

 TolunaEncKey = (int(int(GID) + 3) % 4001) * 17
 HQTolunaEnc.val = TolunaEncKey
 #setExtra("TolunaEnc",str(TolunaEncKey))
</exec>

<suspend/>

<text 
  label="HQTolunaEnc"
  randomize="0"
  size="25"
  translateable="0"
  where="execute,survey,report">
  <title>TolunaEnc</title>

</text>

<suspend/>

<quota label="tot" overquota="noqual" sheet="tot"/>

<suspend/>

<radio 
  label="RespStatus"
  where="execute,survey,report">
  <title>STATUS</title>
  <exec>
#incomplete
status(True,'r2')
  </exec>

  <row label="r1" value="1">complete</row>
  <row label="r2" value="2">incomplete</row>
  <row label="AgreeC" value="3">Agree-Close</row>
  <row label="Scr_Video" value="4">Scr_Video</row>
  <row label="Scr_Audio" value="5">Scr_Audio</row>
  <row label="r96" value="96">Removed - Over Quota/ Sample</row>
  <row label="r97" value="97">Removed - QC</row>
  <row label="r98" value="98">Unsubscribed</row>
  <row label="r99" value="99">Failed Data Trapping Test</row>
</radio>

<suspend/>

<radio 
  label="Agree"
  randomize="0">
  <title><b>개인정보 보호에 대한 정책</b><br /><br />
본 설문에 참여해 주셔서 대단히 감사합니다. 귀하의 의견은 저희에게 매우 중요하며 귀하께서 응답하신 내용은 철저히 비밀이 보장됩니다.
<br />시작하시려면 아래의 버튼을 클릭해 주십시오. 설문이 진행되는 동안에는 설문조사용 화면 아래에 있는 버튼만 사용해 주시고 귀하의 브라우저에 있는 버튼은 사용하지 말아 주십시오.
<br />응답내용에 대한 비밀보장과 개인정보 보호에 대한 정책을 보기를 원하시면 <a href="https://platformsolutions.nielseniq.com/ourweb/privacy/KO/privacy.asp" target="_blank">여기를 클릭</a>해 주십시오.<br /><br />

<p><b>정보 기밀 유지</b><br />응답자는 법규에 의거한 경우를 제외하고는 모든 온라인 조사와 관련된 정보 및 내용을 기밀로 유지하며, 제 삼자와 공유하지 않습니다.<br /><br />

<b>지적 재산 및 저작권에 관한 공지</b><br />
Copyright ⓒ 2019 Nielsen. All rights reserved. 본 조사의 저작권 및 제공자료는 Nielsen에 소유되어 있습니다. Nielsen의 동의 없이 본 조사에 관한 어떠한 내용도 사용, 노출, 재생, 복사, 배포, 수정, 제공, 재발행 또는 정정할 수 없습니다. 본 조사에 대한 접근을 통하여 귀하 또는 제 삼자에게 어떠한 지적 재산권도 양도되지 않습니다. 본 조사에 대한 모든 권한과, 법적 권리 및 이권은 Nielsen의 독자적인 재산입니다.</p>

<br /><br />
<div style="border-style: solid; border-width: 1px; padding: 1px 4px 1px 4px;"><i>아래를 클릭하여, 앞서 진술된 모든 약관에 동의하고, <b>또</b> 귀하께서 <b>18</b> 세 이상 <font style="color: red;">또는 부모나 보호자의 동의 하에 본 조사에 참여하신 18세 미만이라는 점 및 정보 기밀 유지에 동의 여부 표시를 해주시기 바랍니다. </font></i></div>
</title>
  <row label="r1" value="1">예, 동의합니다</row>
  <row label="r2" value="2">아니요, 동의하지 않습니다</row>
</radio>

<suspend/>

<exec>
status(Agree.r2,'AgreeC')
</exec>

<term label="Agreeclose" cond="Agree.r2">Agree Close</term>

<suspend/>

<textarea 
  label="Feedback"
  randomize="0"
  optional="1">
  <title>질문은 이것으로 마칩니다. 저희 온라인 설문에 대한 귀하의 제안이나 의견이 있으시면 말씀해 주시면 감사하겠습니다. 향후 저희 설문 조사에 도움이 될만한 것이면 어떤 것이라도 좋습니다.</title>
</textarea>

<suspend/>"""
    FOOTER = """<exec>
status(True,'r1')
</exec>
</survey>"""

    return[HEADER,FOOTER]


def newSurveyMCP():
    HEADER = """<?xml version="1.0" encoding="UTF-8"?>
<survey 
  alt=""
  autosave="0"
  builder:wizardCompleted="1"
  builderCompatible="1"
  compat="147"
  delphi="1"
  displayOnError="all"
  extraVariables="source,record,decLang,list,userAgent"
  fir="on"
  html:showNumber="0"
  markerTimeout="0"
  mobile="compat"
  mobileDevices="smartphone,tablet,desktop"
  name="Survey"
  persistentExit="1"
  secure="1"
  setup="term,decLang,quota,time"
  ss:disableBackButton="1"
  ss:enableNavigation="1"
  ss:hideProgressBar="0"
  ss:includeCSS="survey/selfserve/nielseniq.css"
  ss:logoAlt="Nielsen Consumer LLC"
  ss:logoFile="selfserve/nielseniq.png"
  ss:logoPosition="left"
  state="testing"
  theme="company/nielseniq-new">

<res label="chk_plz">Please check the response again.</res>
<res label="samegrid">entered the same answer.</res>
<res label="softerr"><br />Please check the response again. If the answer is correct, click the Next button and proceed.</res>
<res label="err2010">Please enter at least one answer</res>
<res label="err2011">Please don't enter the same answer</res>
<res label="err2012">Please enter answers from first text box consecutively.</res>
<res label="err2050">Please do not enter duplicate(s).</res>
<res label="doNotIE">Do not use internet explorer</res>
<samplesources default="0">
  <samplesource list="0">
    <title>Open Survey</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="CO" required="1" values="1,2,3"/>
    <exit cond="terminated">Thank you for taking our survey.</exit>
    <exit cond="qualified">Thank you for taking our survey. Your efforts are greatly appreciated!</exit>
    <exit cond="overquota">Thank you for taking our survey.</exit>
  </samplesource>

  <samplesource list="2">
    <title>Toluna</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="CO" required="1" values="1,2,3"/>
    <var name="GID" unique="1"/>
    <var name="sname" required="1"/>
    <exit cond="terminated" url="http://ups.surveyrouter.com/trafficui/mscui/SOTerminated.aspx?sname=${sname}&amp;TolunaEnc=${HQTolunaEnc.val}&amp;GID=${GID}"/>
    <exit cond="overquota" url="http://ups.surveyrouter.com/trafficui/mscui/SOQuotafull.aspx?sname=${sname}&amp;TolunaEnc=${HQTolunaEnc.val}&amp;GID=${GID}"/>
    <exit cond="qualified" url="http://ups.surveyrouter.com/trafficui/mscui/SOQualified.aspx?sname=${sname}&amp;TolunaEnc=${HQTolunaEnc.val}&amp;GID=${GID}"/>
  </samplesource>
</samplesources>

<suspend/>

<style name="respview.client.css"><![CDATA[
<style>
.blackdiv{ width: 90%; text-align: center; height: 100%; line-height: 32px; font-size: 20px; color: #fff!important; background-color: black!important; border-radius: 32px; margin:0 auto;height:100%;padding:5px;}
.bluediv{ width: 90%; text-align: center; height: 100%; line-height: 32px; font-size: 20px; color: #fff!important; background-color: #2196F3!important; border-radius: 32px; margin:0 auto;height:100%;padding:5px;}
.greendiv{ width: 90%; text-align: center; height: 100%; line-height: 32px; font-size: 20px; color: #fff!important; background-color: #86E57F!important; border-radius: 32px; margin:0 auto;height:100%;padding:5px;}
.bu{ font-weight:bold; text-decoration: underline;}
.boldblue{ font-weight:bold; color:blue; }
.boldgreen{ font-weight:bold; color:green; }
.boldred{ font-weight:bold; color:red; }
.boldcol{ font-weight:bold; color: #00ACEF;}
.autosave-restart{ display:none !important; }
.hidden{display: none !important;}
.hangle{color:red;border:0;text-align:right;width:200px; }
.question-text{ word-break: keep-all;}
.sq-cardsort-bucket-count{display: none !important;}


</style>
]]></style>
<style name="respview.client.js"><![CDATA[
<script>
$ (document).ready(function(){

  //browswer check
  var agent = navigator.userAgent.toLowerCase();
  if( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
    $ ("#browswerchk").show();
    $ ("#btn_continue").hide();
  }else{
    $ ("#browswerchk").hide();
    $ ("#btn_continue").show();
  }

  $ (".autosave-restart").hide();

  $ (document).change(function(){
    for(var i=1; i<=10; i++){
      var base = '.rank'+i+'.exclusive';
      var auto_cnt = i+1;
      var auto = '.rank'+auto_cnt+'.exclusive';
      if( $ (base).find('input[type=radio]').is(':checked') ){
        $ (auto).find('input[type=radio]').prop('checked',true);
        $ ('.rank'+i).find('.fir-icon.selected').attr('class','fir-icon');
        $ (base).find('.fir-icon').attr('class','fir-icon selected');
      }
    }
  });
});

function base_item(n){
  var base = $ ('.bases.r'+n+'br').find('select');
  var item = $ ('.items.r'+n+'br').find('select');
  
  if(!item.find('option').hasClass("base0")){
    var mClone = item.clone();
    var DrOpt1 = base.val();
    var baseClass = base.find("option:selected").attr('class');

    if( DrOpt1 == -1 ){
      item.find("option").remove();
      item.append(mClone.find("option[value=-1]").clone());
    }else{
      selectval = item.val();
      item.find("option").remove();
      item.append(mClone.find("option[value=-1]").clone());
      item.append(mClone.find("option[class="+baseClass+"]").clone());
      item.val(selectval);
    }
    item.find("option[value=-1]").addClass("base0");

   base.change(function(){
      DrOpt1 = base.val();
      baseClass = base.find("option:selected").attr('class');

      if( DrOpt1 == -1 ){
        item.find("option").remove();
        item.append(mClone.find("option[value=-1]").clone());
      }else{
        item.find("option").remove();
        item.append(mClone.find("option[value=-1]").clone());
        item.append(mClone.find("option[class="+baseClass+"]").clone());
      }
    });
  }
}
</script>
]]></style>
<suspend/>

<style label="hideElements" name="question.element"><![CDATA[
\@if ec.simpleList
<div class="element $(rowStyle) $(levels) $(extraClasses) ${col.group.styles.ss.groupClassNames if col.group else (row.group.styles.ss.groupClassNames if row.group else "")} $(col.styles.ss.colClassNames) $(row.styles.ss.rowClassNames) ${"clickableCell" if isClickable else ""}"$(extra)>
    ${v2_insertStyle('el.label.start')}
    ${v2_insertStyle('el.label.end')}
</div>
\@else
<$(tag) $(headers) class="cell nonempty element $(levels) ${"desktop" if this.grouping.cols else "mobile"} border-collapse $(extraClasses) ${col.group.styles.ss.groupClassNames if col.group else (row.group.styles.ss.groupClassNames if row.group else "")} $(col.styles.ss.colClassNames) $(row.styles.ss.rowClassNames) ${"clickableCell" if isClickable else ""}"$(extra)>
    ${v2_insertStyle('el.label.start')}
    ${v2_insertStyle('el.label.end')}
</$(tag)>
\@endif
]]></style>
<suspend/>

<exec when="init">
imgdr = "https://nielsenkor.cafe24.com/OURWEB/KOREA/"

def status(condt,label):
    if condt : 
      RespStatus.val=getattr(RespStatus,"{}".format(label)).index

def rk(none_arr):
  none=none_arr
  for i in this.rows :
    flag=True
    for j in none :
      if i.label==j :
        flag=False
    if flag :
      if i.count &gt;= 2 :
        return error(this.lget('duplicate-row'))

def dat(filename,baseid,basecode) :
  datfile=File(filename,baseid)
  if datfile:
    data_dict=datfile.get(basecode)
    return data_dict

def datToDict(filename,baseid,basecode) :
  dat_dict={}
  dats = dat(filename,baseid,basecode)
  if dats:
    for n,v in dat(filename,baseid,basecode).items() :
      dat_dict[n]=v
    return dat_dict

def soft_Err(str):
  if p.chk==0 :
    p.chk=1
  else :
    p.chk=0
    error(str)

def samegrid():
  qid = allQuestions[this.label]
  checkAnswer = [i.label for i in qid.rows if not i.val == None]
  if len(checkAnswer) gt 1 :
    if len(set(qid.val)-set([None])) == 1:
      soft_Err(res.samegrid+res.softerr)
    else :
      p.chk=1

def rankCnt(multiBase,maxRank):
  cnt = maxRank
  if not multiBase.count ge maxRank :
    cnt = multiBase.count
  return cnt


# dupchk open list
def checkOpen():
  str_1=res.err2010
  str_2=res.err2011
  str_3=res.err2012

  set_list=[]
  
  vals=[i.val for i in this.rows if not i.val == None]
  for s in vals:
    if s != "" :
      flag=True
      set_list.append(s.upper())


  if not set_list :
    error(str_1)
  else :
    for j in range(0,len(set_list)-1):
        preval=this.rows[j].val
        st=j+1
        for i in range(st,len(set_list)):
            postval=this.rows[i].val
            if preval != "" and postval != "" :
              if preval==postval:
                  error(str_2)

    for k in range(0,len(set_list)):
      if this.rows[k].val=="":
        error(str_3)



# TMO Error
def checkDuplicates(Qid) :
  # before Q
  Arr=[]
  
  # Curret Q
  Brr=[]
  
  # Label Array
  Crr=[]
  
  vls=allQuestions[Qid].values

  for i in vls:
    Arr.append(i.upper())
    Crr.append(i)

  for j in this.values:
    Brr.append(j.upper())


  if len(Arr) gt 0 and len(Brr) gt 0:
    if (Brr[0]!=""):
      for i in range(0,len(Brr)):
        preText=Brr[i]
        for j in range(0,len(Arr)):
          currentText=Arr[j]
          if preText!="" and currentText!="":
            if preText==currentText:
              errstr=Crr[j]+'-'+res.err2050
              error(errstr)
              break


def badtext() :
  tt=[i.replace(" ","") for i in this.values if not i==None]
  badhan=(res.badhan)
  badhan=badhan.split(',')

  badspa=(res.badspa)
  badspa=badspa.split(',')


  for i in range(0,len(tt)) :
    current_v=tt[i]
    current_len=len(current_v)
    for j in range(0,int(current_len),3) :
      fn=j
      ln=int(j)+3
      if current_v[fn:ln] in badhan :
        error(res.badhan_err)


  for i in range(0,len(tt)) :
    current_v=tt[i]
    current_len=len(current_v)
    for j in range(0,int(current_len),1) :
      if current_v[j] in badspa :
        error(res.badspa_err)
</exec>

<suspend/>

<exec>
p.chk = 1
</exec>

<suspend/>

<style cond="1" name="survey.respview.footer.support"><![CDATA[
Copyright &#9400; ${time.strftime('%Y')} Nielsen Consumer LLC. All Rights Reserved. <a href="@(PrivacyPolicyUrl)" target="_blank" rel="noopener">@(PrivacyPolicy)</a>.
]]></style>
<style name="survey.completion"><![CDATA[
\@if not gv.survey.root.styles.ss.hideProgressBar
    <div class="progress-bar progress-${"top" if gv.survey.root.progressOnTop else "bottom"}" title="@(progress-bar) - $(percent)% @(complete)">
      <div class="progress-box-outer"><span class="progress-box-completed" style="width: $(percent)%;"></span></div>
      <div class="progress-text"><span class="screen-readers-only">@(progress-bar) </span>$(percent)%</div>
    </div>
    <div id="browswerchk" style="display:none;color:red;"><span>${res.doNotIE}</span></div>
\@endif
]]></style>
<exec>
allL = ["english", "german", "simplifiedchinese"]

p.Ldict={
  1:["english"],
  2:["german"],
  3:["simplifiedchinese"]
}
</exec>

<suspend/>

<radio 
  label="HQ1">
  <title>(HIDDEN) Country</title>
  <exec>
country_label = "r{}".format(CO)
if hasattr(HQ1, country_label) :
    HQ1.val = HQ1.attr(country_label).index
  </exec>

  <row label="r1" value="1">US</row>
  <row label="r2" value="2">China</row>
  <row label="r3" value="3">Germany</row>
</radio>

<suspend/>

<note>LIVE : rowCond="row.label in p.Ldict[HQ1.selected.value]"</note>
<radio 
  label="LQ"
  grouping="cols"
  uses="languageselector.1"
  where="survey,notdp">
  <title>Please select the language you would like to take this survey in.</title>
  <comment>Please select a language</comment>
</radio>

<suspend/>

<exec>
p.langcode={
  "german":"de",
  "english":"en",
  "simplifiedchinese":"zh"
}
</exec>

<radio 
  label="RespStatus"
  where="execute,survey,report">
  <title>STATUS</title>
  <exec>
#incomplete
status(True,'r2')
  </exec>

  <row label="r1" value="1">complete</row>
  <row label="r2" value="2">incomplete</row>
  <row label="AgreeC" value="3">Agree-Close</row>
  <row label="Scr_Video" value="4">Scr_Video</row>
  <row label="Scr_Audio" value="5">Scr_Audio</row>
  <row label="r96" value="96">Removed - Over Quota/ Sample</row>
  <row label="r97" value="97">Removed - QC</row>
  <row label="r98" value="98">Unsubscribed</row>
  <row label="r99" value="99">Failed Data Trapping Test</row>
</radio>

<suspend/>

<radio 
  label="Agree"
  randomize="0"
  sst="0">
  <title>
Participation in this survey is voluntary.Your responses will be used to perform our research and prepare reports and analyses for our clients. We will keep your information confidential and will only share it with trusted third parties who are required to keep this information confidential. Neither your name nor any other identifying information will be used in any reports or analyses that we prepare for our clients.<br /><br />

For more information about how Nielsen uses and protects your information in connection with this survey, please visit:<br />
<a href="https://nielsenwebsurveys.com/ourweb/privacy/${p.langcode[LQ.selected.label]}/privacy.asp" target="_blank">https://nielsenwebsurveys.com/ourweb/privacy/${p.langcode[LQ.selected.label]}/privacy.asp</a><br /><br />

Are you aware of the privacy policy and do you AGREE that we can proceed with the interview?<br /><br />

To begin, click on the button below. As you move through the survey, please use the buttons at the bottom of each screen. Do not use your browser buttons.<br />
If you would like to pause the survey to return to it later, simply close the browser window and click on your original link to return.
</title>
  <row label="r1" value="1">Agree</row>
  <row label="r2" value="2">Disagree</row>
</radio>

<suspend/>

<exec>
status(Agree.r2,'AgreeC')
</exec>

<term label="Agreeclose" cond="Agree.r2">Agree Close</term>

<suspend/>



<suspend/>"""
    FOOTER = """<exec>
status(True,'r1')
</exec>
</survey>"""

    return[HEADER,FOOTER]

def newSurveyCMB():
    HEADER = """
            <survey
             name="Survey"
             alt=""
             autosave="1"
             extraVariables="source,list,url,record,ipAddress,userAgent,decLang"
             compat="138"
             builderCompatible="1"
             secure="0"
             setup="time,term,quota,decLang"
             ss:disableBackButton="1"
             trackCheckbox="1"
             mobile="compat"
             mobileDevices="smartphone,tablet,featurephone,desktop"
             state="testing"
             unique="">

            <!-- IMPORTANT: Remember to copy the nstyles file from v2/cmb/temp-cmb to the current project directory -->

            <samplesources default="0">
              <samplesource list="0" title="default">
                <exit cond="qualified"><b>Thanks again for completing the survey!<br/><br/>Your feedback and quick response to this survey are greatly appreciated.</b></exit>
                <exit cond="terminated"><b>Thank you for your input!</b></exit>
                <exit cond="overquota"><b>Thank you for your input!</b></exit>
              </samplesource>
            </samplesources>"""
    FOOTER = """</survey>"""
    return[HEADER,FOOTER]

def newSurveyEBAY():
    HEADER = """<survey
             name="eBay Survey"
             alt=""
             autosave="1"
             extraVariables="source,list,url,record,ipAddress,userAgent,co,decLang"
             compat="138"
             builderCompatible="1"
             secure="0"
             state="testing"
             setup="time,term,quota,decLang"
             ss:disableBackButton="1"
             displayOnError="all"
             unique=""
             mobile="compat"
             mobileDevices="smartphone,tablet,featurephone,desktop"
             lang="english"
             otherLanguages="danish,german,finnish,french,norwegian,spanish,swedish,uk">

            <res label="privacyText">Privacy Policy</res>
            <res label="helpText">Help</res>

            <!-- Remove or add countries as needed -->
            <languages default="english">
              <language name="danish" var="co" value="dk"/>
              <language name="german" var="co" value="de"/>
              <language name="finnish" var="co" value="fi"/>
              <language name="french" var="co" value="fr"/>
              <language name="norwegian" var="co" value="no"/>
              <language name="spanish" var="co" value="es"/>
              <language name="swedish" var="co" value="se"/>
              <language name="uk" var="co" value="uk"/>
              <language name="english" var="co" value="us"/>
            </languages>

            <!-- Remove or add countries as needed -->
            <radio label="vco" title="Country" virtual="bucketize(co)">
              <row label="dk">Denmark</row>
              <row label="de">Germany</row>
              <row label="fi">Finland</row>
              <row label="fr">France</row>
              <row label="no">Norway</row>
              <row label="es">Spain</row>
              <row label="se">Sweden</row>
              <row label="uk">United Kingdom</row>
              <row label="us">United Sates</row>
            </radio>

            <!-- Remove or add countries as needed -->
            <samplesources default="1">
              <samplesource list="1" title="eBay Sample">
             <!--  <var name="source" filename="invited.txt" unique="1"/>  un-comment this before launching -->
               <var name="co" required="1" values="dk,de,fi,fr,no,es,se,uk,us"/>
                <exit cond="qualified and co=='dk'" timeout="8" url="http://www.ebay.dk">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='dk'" timeout="8" url="http://www.ebay.dk">Thank you for your input!</exit>
                <exit cond="overquota and co=='dk'" timeout="8" url="http://www.ebay.dk">Thank you for your input!</exit>

                <exit cond="qualified and co=='de'" timeout="8" url="http://www.ebay.de">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='de'" timeout="8" url="http://www.ebay.de">Thank you for your input!</exit>
                <exit cond="overquota and co=='de'" timeout="8" url="http://www.ebay.de">Thank you for your input!</exit>

                <exit cond="qualified and co=='fi'" timeout="8" url="http://www.ebay.fi">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='fi'" timeout="8" url="http://www.ebay.fi">Thank you for your input!</exit>
                <exit cond="overquota and co=='fi'" timeout="8" url="http://www.ebay.fi">Thank you for your input!</exit>

                <exit cond="qualified and co=='fr'" timeout="8" url="http://www.ebay.fr">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='fr'" timeout="8" url="http://www.ebay.fr">Thank you for your input!</exit>
                <exit cond="overquota and co=='fr'" timeout="8" url="http://www.ebay.fr">Thank you for your input!</exit>

                <exit cond="qualified and co=='no'" timeout="8" url="http://www.ebay.no">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='no'" timeout="8" url="http://www.ebay.no">Thank you for your input!</exit>
                <exit cond="overquota and co=='no'" timeout="8" url="http://www.ebay.no">Thank you for your input!</exit>

                <exit cond="qualified and co=='es'" timeout="8" url="http://www.ebay.es">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='es'" timeout="8" url="http://www.ebay.es">Thank you for your input!</exit>
                <exit cond="overquota and co=='es'" timeout="8" url="http://www.ebay.es">Thank you for your input!</exit>

                <exit cond="qualified and co=='se'" timeout="8" url="http://www.ebay.se">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='se'" timeout="8" url="http://www.ebay.se">Thank you for your input!</exit>
                <exit cond="overquota and co=='se'" timeout="8" url="http://www.ebay.se">Thank you for your input!</exit>

                <exit cond="qualified and co=='uk'" timeout="8" url="http://www.ebay.co.uk">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='uk'" timeout="8" url="http://www.ebay.co.uk">Thank you for your input!</exit>
                <exit cond="overquota and co=='uk'" timeout="8" url="http://www.ebay.co.uk">Thank you for your input!</exit>

                <exit cond="qualified and co=='us'" timeout="8" url="http://www.ebay.com">Survey Completed - Thank you for your time and opinions!</exit>
                <exit cond="terminated and co=='us'" timeout="8" url="http://www.ebay.com">Thank you for your input!</exit>
                <exit cond="overquota and co=='us'" timeout="8" url="http://www.ebay.com">Thank you for your input!</exit>
              </samplesource>
            </samplesources>


            <html label="StandardIntro" where="survey">Thank you for taking the time to complete this survey. Your opinions are extremely valuable, and will help us to improve your eBay experience. Your responses are completely confidential and will only be used for research purposes. Your responses will be analyzed only in combination with those of other participants. See our <a href="http://pages.ebay.com/help/policies/privacy-policy.html" target="_blank">privacy policy</a>.</html>
            <suspend/>

            """


    FOOTER = """</survey>"""
    return[HEADER,FOOTER]

def newSurveyFMA():
    HEADER = """<survey
             name="Survey"
             alt=""
             autosave="0"
             extraVariables="source,list,url,record,ipAddress,userAgent,decLang"
             compat="124"
             builderCompatible="1"
             secure="0"
             state="testing"
             setup="time,term,quota,decLang"
             ss:disableBackButton="1"
             fwoe="text"
             mobile="compat"
             mobileDevices="smartphone,tablet,featurephone,desktop"
             ss:logoFile="fma/surveysonline_logo.gif"
             ss:logoPosition="left">

            <samplesources default="0">
              <samplesource list="0" title="default">
                <exit cond="qualified"><b>Thanks again for completing the survey!<br/><br/>Your feedback and quick response to this survey are greatly appreciated.</b></exit>
                <exit cond="terminated"><b>Thank you for your input!</b></exit>
                <exit cond="overquota"><b>Thank you for your input!</b></exit>
              </samplesource>
            </samplesources>"""

    FOOTER = """

                <radio label="vStatus" title="Status">
                <virtual>
                if 'recovered' in markers:
                    data[0][0] = 3
                else:
                    if 'qualified' in markers:
                        data[0][0] = 2
                    elif 'OQ' in markers:
                        data[0][0] = 1
                    else:
                        data[0][0] = 0
                </virtual>
                  <row label="r1">Term</row>
                  <row label="r2">OQ</row>
                  <row label="r3">Quals</row>
                  <row label="r4">Partials</row>
                </radio>

                </survey>"""
    return[HEADER,FOOTER]

def newSurveyGDI():
    HEADER = """<survey
                 name="Survey"
                 alt=""
                 autosave="0"
                 extraVariables="source,list,url,record,ipAddress,userAgent,decLang"
                 compat="138"
                 builderCompatible="1"
                 secure="0"
                 state="testing"
                 setup="time,term,quota,decLang"
                 ss:disableBackButton="1"
                 fixedWidth="tight"
                 mobile="compat"
                 mobileDevices="smartphone,tablet,featurephone,desktop"
                 zeroPad="1">

                <samplesources default="1">
                  <samplesource list="1" title="Greenfield/Toluna">
                    <var name="gid" unique="1"/>
                    <exit cond="qualified" url="http://ups.surveyrouter.com/soqualified.aspx?gid=${gid}"/>
                    <exit cond="terminated" url="http://ups.surveyrouter.com/soterminated.aspx?gid=${gid}"/>
                    <exit cond="overquota" url="http://ups.surveyrouter.com/soquotafull.aspx?gid=${gid}"/>
                  </samplesource>
                </samplesources>

                <number altlabel="record" fwidth="10" label="vrec" size="10" title="Record As Number" virtual="if record:  data[0][0] = int(record)"/>
                """

    FOOTER = """</survey>"""
    return[HEADER,FOOTER]

def newSurveySRG():
    HEADER = """<survey
             name="Survey"
             alt=""
             autosave="0"
             extraVariables="source,list,url,record,ipAddress,userAgent,flashDetected,decLang"
             compat="138"
             builderCompatible="1"
             secure="0"
             state="testing"
             setup="time,term,quota,decLang"
             mobile="compat"
             mobileDevices="smartphone,tablet,featurephone,desktop"
             ss:disableBackButton="1"
             ss:colorScheme="theme_red-01"
             fixedWidth="tight">

            <samplesources default="0">
              <samplesource list="0" title="default">
                <exit cond="qualified"><b>Thanks again for completing the survey!<br/><br/>Your feedback and quick response to this survey are greatly appreciated.</b></exit>
                <exit cond="terminated"><b>Thank you for your input!</b></exit>
                <exit cond="overquota"><b>Thank you for your input!</b></exit>
              </samplesource>
            </samplesources>"""
    FOOTER = """</survey>"""
    return[HEADER,FOOTER]

def newSurveyGMI():
    HEADER = """<survey
             name="Survey"
             alt=""
             autosave="1"
             autosaveKey="ac"
             extraVariables="source,list,url,record,ipAddress,userAgent,flashDetected,ac,sn,lang,co,decLang"
             setup="time,term,quota,decLang"
             ss:disableBackButton="1"
             displayOnError="all"
             unique=""
             compat="138"
             builderCompatible="1"
             secure="0"
             mobile="compat"
             mobileDevices="smartphone,tablet,featurephone,desktop"
             state="testing">

            <exec when="init">
            db_completed = Database( name="completed" )
            </exec>
            <exec>
            db_id = ac
            p.completedID = db_id
            </exec>

            <samplesources default="1">
              <completed>It seems you have already entered this survey.</completed>
              <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
              <samplesource list="1" title="GMI">
                <var name="ac" unique="1"/>
                <var name="sn" required="1"/>
                <var name="lang" required="1"/>
                <exit cond="qualified" url="http://globaltestmarket.com/20/survey/finished.phtml?ac=${ac}&amp;sn=${sn}&amp;lang=${lang}"/>
                <exit cond="terminated" url="http://globaltestmarket.com/20/survey/finished.phtml?ac=${ac}&amp;sn=${sn}&amp;lang=${lang}&amp;sco=s"/>
                <exit cond="overquota" url="http://globaltestmarket.com/20/survey/finished.phtml?ac=${ac}&amp;sn=${sn}&amp;lang=${lang}&amp;sco=o"/>
              </samplesource>
            <samplesources>

            <html cond="db_completed.has(p.completedID)" final="1" label="dupe" where="survey">It seems you have already participated in this survey.</html>
            """
    FOOTER = """
                <exec when="finished">
                if gv.survey and gv.survey.root.state.live:
                    db_completed.add(p.completedID)
                </exec>

                </survey>"""
    return[HEADER,FOOTER]

def fixUniCode(input):
    input = input.replace(u"\u2019", "'").replace(u"\u2018", "'").replace(u"\u201C", "\"").replace(u"\u201D", "\"")
    input = re.sub('&\s', '&amp; ',input)
    return input


#need to find a better solution for the surveyType set up
class setSurveyType(sublime_plugin.TextCommand):
    def run(self, edit):
        sels = self.view.sel()
        sel = sels[0]
        surveyType = "<!-- surveyType="+self.view.substr(sel)+" -->"
        self.view.replace(edit,sel, surveyType)

################# Survey types

class makeSurveyCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)

            for sel in sels:
                printPage = ''
                input = self.view.substr(sel).strip()
                input = tidySurveyInput(input)
                #print input
                headerFooter =[]
                ### different variables dependant on survey type

                if docType =='CMB':
                    headerFooter = newSurveyCMB()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])

                    headerFooter =[]
                elif docType =='EBA':
                    headerFooter = newSurveyEBAY()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])
                    headerFooter =[]
                elif docType =='FMA':
                    headerFooter = newSurveyFMA()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])
                    headerFooter =[]
                elif docType =='GDI':
                    headerFooter = newSurveyGDI()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])
                    headerFooter =[]
                elif docType =='SRG':
                    headerFooter = newSurveySRG()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])
                    headerFooter =[]
                elif docType =='GMI':
                    headerFooter = newSurveyGMI()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])
                    headerFooter =[]
                else:
                    headerFooter = newSurvey()
                    printPage = "%s\n\n%s\n\n%s" % (headerFooter[0], input, headerFooter[1])
                    headerFooter =[]

                self.view.replace(edit,sel, printPage)
        except Exception:
            print ('could not create survey layout')
            print (e)


################# Question types
class makeRadioCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)

            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]

                if docType == 'CMB':
                    colCount = len(input.split("<col"))-1

                output = input
                #test for and adjust comment for 2d question
                if output.strip() == '':
                    printpage = printPage = """
<radio 
  label=\"%s\" 
  where="execute">
  <title>%s</title>
  <row label="r1" value="1">True</row>
  <row label="r0" value="0">False</row>
</radio>
<suspend/>""" % (label.strip(), title.strip())
                    return self.view.replace(edit,sel, printpage)


                if "<comment>" not in input:
                    if ("<row" in output) and ("<col" in output):
                        comment = "<comment></comment>\n" if docType != 'SRG' else  "<comment></comment>\n"
                    else:
                        comment = "<comment></comment>\n" if docType != 'SRG' else "<comment></comment>\n"

                # compose our new radio question
                if docType == 'FMA':
                    printPage = "<radio\n  label=\"%s\">\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), title.strip(), output)
                elif docType == 'HAP':

                    rowlegend = ""

                    if ("<row" in output) and not ("<col" in output):
                        rowlegend='\n  rowLegend=\"right\"'

                    # compose our new radio question
                    if "<comment>" not in input:
                      printPage = "<radio\n  label=\"%s\"%s>\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), rowlegend, title.strip(), comment, output)
                    else:
                      printPage = "<radio\n  label=\"%s\"%s>\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), rowlegend, title.strip(), output)
                elif docType == 'CMB':
                        if (("<row" in output) and ("<col" in output) and (colCount > 1)) or not ("<row" in output):
                            style = ''
                        else:
                            style = '\n  style=\"noGrid\"\n  ss:questionClassNames=\"flexGrid\"'

                        # compose our new radio question
                        if "<comment>" not in input:
                          printPage = "<radio\n  label=\"%s\"%s>\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), style, title.strip(), comment, output)
                        else:
                          printPage = "<radio\n  label=\"%s\"%s>\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), style, title.strip(), output)

                else:
                    if "<comment>" not in input:
                      printPage = "<radio\n  label=\"%s\">\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                    else:
                      printPage = "<radio\n  label=\"%s\">\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), title.strip(), output)


                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print ("makeRadio clip failed:")
            print (e)

class makeRatingCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)

            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]

                if docType == 'CMB':
                    rowCount = len(input.split("<row"))-1
                    colCount = len(input.split("<col"))-1

                output = input
                shffl = ""
                style = ""
                comment = ''
                if docType == 'FMA':
                    printPage = "<radio\n  label=\"%s%s%s\"\n  type=\"rating\">\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), output)

                elif docType == 'HAP':
                    #DETERMINE IF WE NEED A 1D OR 2D COMMENT, SHUFFLE 2D ROWS OR COLS, ADD AVERAGES attribute.
                    if ("<row" in output) and ("<col" in output):
                        comment = "<comment></comment>\n"
                        s = output.split("    ")
                        for x in s:
                            if x.count("value=") > 0:
                                if x.count("<col") > 0:
                                    shffl = "\n  shuffle=\"rows\""
                                elif x.count("<row") > 0:
                                    shffl = "\n  shuffle=\"cols\""
                    else:
                        comment = "<comment></comment>\n"

                    rowlegend=""

                    if ("<row" in output) and not ("<col" in output):
                        rowlegend='\n  rowLegend=\"right\"'

                    if "<comment>" not in input:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\"%s>\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), rowlegend, shffl, style, title.strip(), comment, output)
                    else:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\"%s>\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), rowlegend, shffl, style, title.strip(), output)

                elif docType == 'CMB':

                    if ("<row" in output) and ("<col" in output):
                        comment = "<comment></comment>\n"
                        s = output.split("    ")
                        for x in s:
                            if x.count("value=") > 0:
                                if x.count("<col") > 0:
                                    shffl = "\n  shuffle=\"rows\""
                                elif x.count("<row") > 0:
                                    shffl = "\n  shuffle=\"cols\""
                    else:
                        comment = "<comment></comment>\n"

                    if (("<row" in output) and ("<col" in output) and (colCount > 1)) or not ("<row" in output):
                        style = ''
                    else:
                        style = '\n  style=\"noGrid\" ss:questionClassNames=\"flexGrid\"'

                    if "<comment>" not in input:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\">\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), comment, output)
                    else:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\">\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), output)
                elif docType == 'SRG':

                    if (("row" in output) or ("rows" in output)) and (("col" in output) or ("cols" in output)):
                        comment = "<comment></comment>\n"
                        s = output.split("    ")
                        for x in s:
                            if x.count("value=") > 0:
                                if x.count("<col") > 0:
                                    shffl = "\n  shuffle=\"rows\""
                                elif x.count("<row") > 0:
                                    shffl = "\n  shuffle=\"cols\""
                    else:
                        comment = "<comment></comment>\n"

                    if "<comment>" not in input:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\">\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), comment, output)
                    else:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\">\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), output)


                else:
                    #DETERMINE IF WE NEED A 1D OR 2D COMMENT, SHUFFLE 2D ROWS OR COLS, ADD AVERAGES attribute.
                    if (("row" in output) or ("rows" in output)) and (("col" in output) or ("cols" in output)):
                        comment = "<comment></comment>\n"
                        s = output.split("    ")
                        for x in s:
                            if x.count("value=") > 0:
                                if x.count("<col") > 0:
                                    shffl = "\n  shuffle=\"rows\""
                                elif x.count("<row") > 0:
                                    shffl = "\n  shuffle=\"cols\""
                    else:
                        comment = "<comment></comment>\n"

                    if "<comment>" not in input:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\">\n  <title>%s</title>\n  %s  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), comment, output)
                    else:
                        printPage = "<radio\n  label=\"%s\"%s%s\n  type=\"rating\">\n  <title>%s</title>\n  %s\n</radio>\n<suspend/>" % (label.strip(), shffl, style, title.strip(), output)


                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print ("makeRating clip failed:")
            print (e)

class makeCheckboxCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]


                #checkbox specific
                rowCount = len(input.split("<row"))-1
                colCount = len(input.split("<col"))-1
                comment = ''
                # add the all important line breakage
                output2 = input

                inputSpl = output2.split('\n')
                output2 = []

                nota_array = [">None of the above",">None of these",">None of the Above",">None of These"]
                noAns = "<noanswer"
                for x in inputSpl:
                    output = ""
                    for nota in nota_array:
                        if nota in x and noAns not in x:
                            repwith = " exclusive=\"1\" randomize=\"0\"" + nota
                            output = x.replace(nota,repwith)

                    if output:
                        output2.append(output)
                    else:
                        output2.append(x)

                output = "\n".join(output2)
                if docType == 'CMB':
                    # set the appropriate comment
                    comment = "<comment></comment>\n"

                    if ("<row" in output) and ("<col" in output) and (colCount > 1):
                        style = ''
                    else:
                        style = '\n  style=\"noGrid\"\n  ss:questionClassNames=\"flexGrid\"'

                    # compose the question
                    if "<comment>" not in input:
                        printPage = "<checkbox\n  label=\"%s\"%s\n  atleast=\"1\">\n  <title>%s</title>\n  %s  %s\n</checkbox>\n<suspend/>" % (label.strip(), style, title.strip(), comment, output)
                    else:
                        printPage = "<checkbox\n  label=\"%s\"%s\n  atleast=\"1\">\n  <title>%s</title>\n  %s\n</checkbox>\n<suspend/>" % (label.strip(), style, title.strip(), output)

                elif docType =='HAP':
                    comment = "<comment></comment>\n"
                    rowlegend=""

                    if ("<row" in output) and not ("<col" in output):
                        rowlegend ='\n  rowLegend=\"right\"'
                        # compose the question
                    if "<comment>" not in input:
                            printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\"%s>\n  <title>%s</title>\n  %s  %s\n</checkbox>\n<suspend/>" % (label.strip(), rowlegend, title.strip(), comment, output)
                    else:
                            printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\"%s>\n  <title>%s</title>\n  %s\n</checkbox>\n<suspend/>" % (label.strip(), rowlegend, title.strip(), output)


                elif docType =='FMA':
                    # compose the question
                    printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\">\n  <title>%s</title>\n  %s\n</checkbox>\n<suspend/>" % (label.strip(), title.strip(), output)
                elif docType =='SRG':
                        comment = "<comment></comment>\n"
                        # compose the question
                        if "<comment>" not in input:
                            printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\">\n  <title>%s</title>\n  %s  %s\n</checkbox>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                        else:
                            printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\">\n  <title>%s</title>\n  %s\n</checkbox>\n<suspend/>" % (label.strip(), title.strip(), output)
                else:
                        # set the appropriate comment
                    comment = "<comment></comment>\n"
                    # compose the question
                    if "<comment>" not in input:
                        printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\">\n  <title>%s</title>\n  %s  %s\n</checkbox>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                    else:
                        printPage = "<checkbox\n  label=\"%s\"\n  atleast=\"1\">\n  <title>%s</title>\n  %s\n</checkbox>\n<suspend/>" % (label.strip(), title.strip(), output)
                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print(e)

class makeSelectCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]
                #start from output = to fill this class
                output = "\n  " + input

                # compose the select question
                printPage = "<select\n  label=\"%s\"\n  optional=\"0\">\n  <title>%s</title>  %s\n</select>\n<suspend/>" % (label.strip(), title.strip(), output)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print(e)

class makeTextareaCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]
                #start from output = to fill this class
                output = input
                if output != "":
                  output = "  " + output + "\n"

                if docType == 'FMA':
                       printPage = "<textarea\n  label=\"%s\"\n  optional=\"0\">\n  <title>%s</title>\n%s</textarea>\n<suspend/>" % (label.strip(), title.strip(), output)
                else :

                    #COMPOSE OUR QUESTION
                    if "<comment>" not in input:
                        comment = "<comment></comment>"
                        printPage = "<textarea\n  label=\"%s\"\n  optional=\"0\">\n  <title>%s</title>\n  %s\n%s</textarea>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                    else:
                        printPage = "<textarea\n  label=\"%s\"\n  optional=\"0\">\n  <title>%s</title>\n%s</textarea>\n<suspend/>" % (label.strip(), title.strip(), output)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print ("makeTextarea failed")
            print(e)

class makeTextCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]

                rowCount = len(input.split("<row"))-1
                colCount = len(input.split("<col"))-1
                #start from output = to fill this class
                # add the all important line breakage
                output = input
                if output != "":
                  output = "  " + output + "\n"

                if docType =='CMB':
                        if (("<row" in output) and ("<col" in output) and (colCount > 1)) or not ("<row" in output):
                            style = ''
                        else:
                            style = ' style=\"noGrid\"'
                        #COMPOSE OUR QUESTION
                        if "<comment>" not in input:
                            comment = "<comment></comment>\n"
                            printPage = "<text\n  label=\"%s\"\n  size=\"40\"\n  optional=\"0\"%s>\n  <title>%s</title>\n  %s  %s\n</text>\n<suspend/>" % (label.strip(), style, title.strip(), comment, output)
                        else:
                            printPage = "<text\n  label=\"%s\"\n  size=\"40\"\n  optional=\"0\"%s>\n  <title>%s</title>\n  %s\n</text>\n<suspend/>" % (label.strip(), style, title.strip(), output)

                elif docType =='FMA':
                    printPage = "<text\n  label=\"%s\"\n  size=\"40\"\n  optional=\"0\">\n  <title>%s</title>\n%s</text>\n<suspend/>" % (label.strip(), title.strip(), output)

                else:
                    if "<comment>" not in input:
                        comment = "<comment></comment>"
                        printPage = "<text\n  label=\"%s\"\n  size=\"40\"\n  optional=\"0\">\n  <title>%s</title>\n  %s\n%s</text>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                    else:
                        printPage = "<text\n  label=\"%s\"\n  size=\"40\"\n  optional=\"0\">\n  <title>%s</title>\n%s</text>\n<suspend/>" % (label.strip(), title.strip(), output)


                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeNumberCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]
                #start from output = to fill this class
                                    # add the all important line breakage
                output = input
                if output != "":
                    output = "  " + output + "\n"
                if docType =='FMA':
                    printPage = "<number\n  label=\"%s\"\n  size=\"3\"\n  optional=\"0\">\n  <title>%s</title>\n%s</number>\n<suspend/>" % (label.strip(), title.strip(), output)

                else:
                    #COMPOSE OUR QUESTION
                    if "<comment>" not in input:
                        comment = "<comment></comment>\n"
                        printPage = "<number\n  label=\"%s\"\n  size=\"3\"\n  optional=\"0\">\n  <title>%s</title>\n  %s%s</number>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                    else:
                        printPage = "<number\n  label=\"%s\"\n  size=\"3\"\n  optional=\"0\">\n  <title>%s</title>\n%s</number>\n<suspend/>" % (label.strip(), title.strip(), output)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeFloatCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                inputLabelTitle = tidyQuestionInput(input)
                input = inputLabelTitle[0]
                label = inputLabelTitle[1]
                title = inputLabelTitle[2]
                #start from output = to fill this class
                                    # add the all important line breakage
                output = input
                if output != "":
                    output = "  " + output + "\n"
                if docType =='FMA':
                    printPage = "<float\n  label=\"%s\"\n  size=\"3\"\n  optional=\"0\">\n  <title>%s</title>\n%s</float>\n<suspend/>" % (label.strip(), title.strip(), output)

                else:
                    #COMPOSE OUR QUESTION
                    if "<comment>" not in input:
                        comment = "<comment></comment>\n"
                        printPage = "<float\n  label=\"%s\"\n  size=\"3\"\n  optional=\"0\">\n  <title>%s</title>\n  %s%s</float>\n<suspend/>" % (label.strip(), title.strip(), comment, output)
                    else:
                        printPage = "<float\n  label=\"%s\"\n  size=\"3\"\n  optional=\"0\">\n  <title>%s</title>\n%s</float>\n<suspend/>" % (label.strip(), title.strip(), output)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)


class makePipeCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            #docType =  returnContext(self)
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                 # get rid of blank lines
                while "\n\n" in input:
                    input = input.replace("\n\n", "\n")

                output = input

                # compose our new pipe tag
                printPage = "<pipe\n  label=\"\"\n  capture=\"\">\n  %s\n</pipe>\n" % (output)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print ('make pipe failed')
            print (e)
############# QUESTION ELEMENTS ######################
class makeRowCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            for sel in sels:
                count = 0
                printPage = ''
                extra = ''
                input = self.view.substr(sel)
                #CLEAN UP THE TABS
                input = re.sub("\t+", " ", input)

                #CLEAN UP SPACES
                input = re.sub("\n +\n", "\n\n", input)

                #CLEAN UP THE EXTRA LINE BREAKS
                input = re.sub("\n{2,}", "\n", input)
                input = fixUniCode(input)

                input = input.strip().split("\n")
                #ebay has a different openSize
                openSize =  '45' if docType =='EBA' else '25'

                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "", input[x])

                for x in input:

                    if "other" in input[count].strip().lower() and "specify" in input[count].strip().lower():
                      input[count] = input[count].strip().replace("_", "")
                      extra=' open=\"1\" openSize=\"'+openSize+'\" randomize=\"0\"'
                    else:
                      extra = ''
                    printPage += "  <row label=\"r%s\"%s>%s</row>\n" % (str(count+1), extra, input[count].strip())
                    count += 1
                # thanks to replace the regions keep updated with their start and end point
                self.view.replace(edit,sel, printPage)

        except Exception as e:
            print (e)

class makeRowAutoValueCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            for sel in sels:
                count = 0
                printPage = ''
                extra = ''
                input = self.view.substr(sel)
                #CLEAN UP THE TABS
                input = re.sub("\t+", " ", input)

                #CLEAN UP SPACES
                input = re.sub("\n +\n", "\n\n", input)

                #CLEAN UP THE EXTRA LINE BREAKS
                input = re.sub("\n{2,}", "\n", input)
                input = fixUniCode(input)

                input = input.strip().split("\n")
                #ebay has a different openSize
                openSize =  '45' if docType =='EBA' else '25'

                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "", input[x])

                for x in input:

                    if "other" in input[count].strip().lower() and "specify" in input[count].strip().lower():
                      input[count] = input[count].strip().replace("_", "")
                      extra=' open=\"1\" openSize=\"'+openSize+'\" randomize=\"0\"'
                    else:
                      extra = ''
                    printPage += "  <row label=\"r%s\"%s value=\"%s\">%s</row>\n" % (str(count+1), extra, str(count+1), input[count].strip())
                    count += 1
                # thanks to replace the regions keep updated with their start and end point
                self.view.replace(edit,sel, printPage)

        except Exception as e:
            print (e)



class makeRowrCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        try:
            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            for sel in sels:
                printPage = ''
                extra = ''
                input = self.view.substr(sel)
                #CLEAN UP THE TABS
                input = re.sub("\t+", " ", input)

                #CLEAN UP SPACES
                input = re.sub("\n +\n", "\n\n", input)

                #CLEAN UP THE EXTRA LINE BREAKS
                input = re.sub("\n{2,}", "\n", input)
                input = fixUniCode(input)

                input = input.strip().split("\n")
                #ebay has a different openSize
                openSize =  '45' if docType =='EBA' else '25'
                counter = 0
                count = len(input)

                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "", input[x])

                for x in input:

                    if "other" in input[count-1].strip().lower() and "specify" in input[count-1].strip().lower():
                      input[count-1] = input[count-1].replace("_", "")
                      extra=' open=\"1\" openSize=\"'+openSize+'\" randomize=\"0\"'
                    else:
                      extra = ''
                    printPage += "  <row label=\"r%s\"%s>%s</row>\n" % (str(count), extra, input[counter].strip())
                    count -= 1
                    counter +=1
                # thanks to replace the regions keep updated with their start and end point
                self.view.replace(edit,sel, printPage)

        except Exception as e:
            print (e)


class makeRowsMatchLabelCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel).strip()
                input = fixUniCode(input)
                #SPLIT UP INTO ROWS
                input = input.split("\n")
                #ebay has a different openSize
                openSize =  '45' if docType =='EBA' else '25'
                #ITERATE ROWS
                count = 0
                for line in input:
                     line = line.strip()
                     #SPLIT ON WHITESPACE -- REMOVE LEADING AND TRAILING WS
                     parts = re.split(r"\s",line,1)

                     #GET RID OF EXTRA SPACES
                     ordinal= parts[0].strip()
                     ordinal= ordinal.rstrip('.')
                     ordinal= ordinal.rstrip(')')

                     #GET RID OF EXTRA SPACES
                     if len(parts) == 2:
                       content = parts[1].strip()


                     extra=""

                     if "other" in content.lower() and "specify" in content.lower():
                       content = content.replace("_", "")
                       extra=' open=\"1\" openSize=\"'+openSize+'\" randomize=\"0\"'

                     #COMPOSE ROW
                     if ordinal[0].isalpha() and (len(parts) == 2):
                       printPage += "  <row label=\"%s\"%s>%s</row>\n" % (ordinal, extra, content)
                     elif ordinal[0].isdigit():
                       printPage += "  <row label=\"r%s\"%s>%s</row>\n" % (ordinal, extra, content)
                     elif (len(parts) == 2):
                       printPage += "  <row label=\"%s\"%s>%s</row>\n" % (ordinal, extra, content)
                     else:
                       count += 1
                       printPage += "  <row label=\"r%s\"%s>%s</row>\n" % (str(count), extra, line)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeRowsMatchValuesCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = fixUniCode(input)
                #SPLIT UP INTO ROWS
                input = input.split("\n")
                #ebay has a different openSize
                openSize =  '45' if docType =='EBA' else '25'
                #ITERATE ROWS
                for line in input:
                    line = line.strip()
                    
                    #SPLIT ON WHITESPACE -- REMOVE LEADING AND TRAILING WS
                    parts = re.split(r"\s",line,1)

                    #GET RID OF EXTRA SPACES
                    ordinal= parts[0].strip()

                    

                    ordinal= ordinal.rstrip('.')
                    ordinal= ordinal.rstrip(')')


                    #GET RID OF EXTRA SPACES
                    if len(parts) == 2:
                        content = parts[1].strip()

                    extra=""

                    if "other" in content.lower() and "specify" in content.lower():
                        content = content.replace("_", "")
                        extra=' open=\"1\" openSize=\"'+openSize+'\" randomize=\"0\"'

                    #COMPOSE ROW
                    printPage += "  <row label=\"r%s\" value=\"%s\"%s>%s</row>\n" % (ordinal,ordinal, extra, content)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeColsCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            #docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = re.sub("\t+", " ", input)
                #CLEAN UP SPACES
                input = re.sub("\n +\n", "\n\n", input)
                #CLEAN UP THE EXTRA LINE BREAKS
                input = re.sub("\n{2,}", "\n", input)
                input = fixUniCode(input)
                input = input.strip().split("\n")
                #start from output = to fill this class
                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "\n", input[x])
                count = 0
                for x in input:
                    if "other" in input[count].strip().lower() and "specify" in input[count].strip().lower():
                        input[count] = input[count].strip().replace("_", "")
                        extra=' open=\"1\" openSize=\"10\" randomize=\"0\"'
                        printPage += "  <col label=\"c%s\"%s>%s</col>\n" % (str(count+1), extra, input[count].strip())
                        count += 1
                    else:
                        extra = ''

                        printPage += "  <col label=\"c%s\"%s>%s</col>\n" % (str(count+1), extra, input[count].strip())
                        count += 1

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeColsMatchLabelCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            #docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = fixUniCode(input)
                input = re.sub("\t+", " ", input)
                #CLEAN UP SPACES
                input = re.sub("\n +\n", "\n\n", input)
                #CLEAN UP THE EXTRA LINE BREAKS
                input = re.sub("\n{2,}", "\n", input)
                input = input.strip().split("\n")
                count = 0
                for line in input:
                     line = line.strip()
                     #SPLIT ON WHITESPACE -- REMOVE LEADING AND TRAILING WS
                     parts = re.split(r"\s",line,1)

                     #GET RID OF EXTRA SPACES
                     ordinal= parts[0].strip()
                     ordinal= ordinal.rstrip('.')
                     ordinal= ordinal.rstrip(')')

                     #GET RID OF EXTRA SPACES
                     if len(parts) == 2:
                       content = parts[1].strip()

                     extra=""

                     if "other" in content.lower() and "specify" in content.lower():
                       content = content.replace("_", "")
                       extra=' open=\"1\" openSize=\"10\" randomize=\"0\"'

                     #COMPOSE ROW
                     if ordinal[0].isalpha() and (len(parts) == 2):
                       printPage += "  <col label=\"%s\"%s>%s</col>\n" % (ordinal, extra, content)
                     elif ordinal[0].isdigit():
                       printPage += "  <col label=\"c%s\"%s>%s</col>\n" % (ordinal, extra, content)
                     else:
                       count += 1
                       printPage += "  <col label=\"c%s\"%s>%s</col>\n" % (str(count), extra, line)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeColsMatchValueCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            #docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = re.sub("\t+", " ", input)
                #CLEAN UP SPACES
                input = re.sub("\n +\n", "\n\n", input)
                #CLEAN UP THE EXTRA LINE BREAKS
                input = re.sub("\n{2,}", "\n", input)
                input = fixUniCode(input)
                input = input.strip().split("\n")

                for line in input:
                     line = line.strip()
                     #SPLIT ON WHITESPACE -- REMOVE LEADING AND TRAILING WS
                     parts = re.split(r"\s",line,1)

                     #GET RID OF EXTRA SPACES
                     ordinal= parts[0].strip()
                     ordinal= ordinal.rstrip('.')
                     ordinal= ordinal.rstrip(')')

                     #GET RID OF EXTRA SPACES
                     content = parts[1].strip()

                     extra=""

                     if "other" in content.lower() and "specify" in content.lower():
                       content = content.replace("_", "")
                       extra=' open=\"1\" openSize=\"10\" randomize=\"0\"'

                     #COMPOSE COLUMN
                     printPage += "  <col label=\"c%s\" value=\"%s\"%s>%s</col>\n" % (ordinal,ordinal, extra, content)

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeChoicesCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = fixUniCode(input)
                input = input.strip().split("\n")

                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "\n", input[x])
                count = 0
                for x in input:
                    printPage += "  <choice label=\"ch%s\">%s</choice>\n" % (str(count+1), input[count].strip())
                    count += 1
            self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeCasesCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = fixUniCode(input)
                while '\n\n' in input:
                    input = input.replace('\n\n', '\n')
                input = input.strip().split("\n")

                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "\n", input[x])
                count = 0
                for x in input:
                    printPage += "  <case label=\"r%s\" cond=\"\">%s</case>\n" % (str(count+1), input[count].strip())
                    count += 1
                printPage += "  <case label=\"r%s\" cond=\"1\">UNDEFINED</case>" % (str(count+1))
                printPage = "<pipe\n  label=\"\"\n  capture=\"\">\n" + printPage + "\n</pipe>"
            self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeGroupsCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel)
                input = fixUniCode(input)
                input = input.strip().split("\n")

                for x in range(0,len(input)):
                    input[x] = re.sub("^[a-zA-Z0-9]{1,2}[\.:\)][ \t]+", "\n", input[x])
                for x in range(len(input)):
                    printPage += "  <group label=\"g" + str(x+1) + "\">" + re.sub(r"^[a-zA-Z0-9]+(\.|:)|^[a-zA-Z0-9]+[a-zA-Z0-9]+(\.|:)", "", input[x]).strip() + "</group>\n"
            self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)

class makeLoopBlockCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel).strip()
                input = re.sub(r'<(radio|checkbox|text|textarea|block|number|float|select|html)(.*) label="([^"]*)"',r'<\1\2 label="\3_[loopvar: label]"', input)

                printPage = """
<loop
  label=""
  vars="">
  
<block
  label="">

%s

</block>

<looprow label="" cond=""><loopvar name=""></loopvar></looprow>
</loop>""" % input

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)


class makeSwitchCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:
            sels = self.view.sel()
            for sel in sels:

                vrange = self.view.substr(sel).strip("\n").split("\n")

                for i in range(len(vrange)):

                    if "<row" in vrange[i]:
                        this1 = "row"
                        that1 = "col"
                        this2 = "r"
                        that2 = "c"
                    elif "<col" in vrange[i]:
                        this1 = "col"
                        that1 = "row"
                        this2 = "c"
                        that2 = "r"
                    vrange[i] = re.sub("(<|\/)" + this1, r'\1' + that1, vrange[i])
                    vrange[i] = re.sub('label="%s' % this2, 'label="%s' % that2, vrange[i])

                vrange = "\n".join(vrange)
                self.view.replace(edit,sel, vrange)
        except Exception as e:
            print (e)

class makeCommentCommand(sublime_plugin.TextCommand):
    def run (self,edit):
        try:

            sels = self.view.sel()
            input = ''
            docType =  returnContext(self)
            #print self.view.settings()
            for sel in sels:
                printPage = ''
                input = self.view.substr(sel).strip()
                input = fixUniCode(input)
                input = input.replace("\n", "<br/>\n")
                printPage = "<html\n  label=\"\"\n  where=\"survey\">%s</html>" % input

                self.view.replace(edit,sel, printPage)
        except Exception as e:
            print (e)


