declare let $: any
declare let _: any

const query = "https://www.illc.uva.nl/NewsandEvents/Events/Conferences/"

$.ajax({
  url:  query,
  type: 'POST',
  data: {
    id: 1,
    mode: 'hoge'
  },
  dataType: 'html'
}).done(( data, textStatus, jqXHR )=> {
    console.log(textStatus)//success
    const $objs  = getJsonFromHTML(data,1)
    const $htmlstr = obj2htmlstr( $objs,1)
    const $objs2  = getJsonFromHTML(data,2)
    const $htmlstr2 = obj2htmlstr( $objs2,2)
    document.getElementById("id_conf_list").innerHTML  = $htmlstr
    document.getElementById("id_conf_list2").innerHTML = $htmlstr2//writeHtml(HTML_TABLE)
        // console.log(data)
    // console.log(textStatus)
    // console.log(jqXHR)
}).fail(( jqXHR, textStatus, errorThrown)=> {
    console.log(textStatus)//fail
}).always(( jqXHR, textStatus)=> {
    console.log(textStatus)//always
});

function obj2htmlstr(xobjs,$deadOrComing:number): string{
                let $html_table = "";
                for (var i = 0; i < xobjs.length; i++) {
                const _detail_url = query + xobjs[i].detail_url
                const _conf_date = xobjs[i].conf_date
                const _conf_name = xobjs[i].conf_name
                const _conf_place = xobjs[i].conf_place
                const _deadline = () => {
                    const hoge = xobjs[i].deadline
                    if (hoge === undefined) {
                        return "-"
                    } else {
                        return hoge
                    }
                }
                $html_table += `<tr>`
                $html_table += `<td>${_deadline()}</td>`
                $html_table += `<td style="width:120px">${_conf_date}</td>`
                $html_table += `<td>${_conf_name}</td>`
                $html_table += `<td>${_conf_place}</td>`
                $html_table += `<td><a href="${_detail_url}"  target="_blank">detail</a></td>`
                $html_table += `</tr>`
            }

        function deadORcom(x:number):string{
            if (x===1){
                return "Deadline"
            }else if (x ===2){
                return ""
            }else {
                return "Error"
            }
        }

        const _html = `\
            <table id="id_sorttable" class="tablesorter ">
                <thead>
                    <tr>
                        <th>${deadORcom($deadOrComing)}</th>
                        <th>Date<br></th>
                        <th>Conference name</th>
                        <th>Place<br></th>
                        <th>Link<br></th>
                    </tr>
                </thead>`+
            $html_table +
            `</table>`
        return _html
}

function getJsonFromHTML($html: string,$deadOrComing:number) {
    let _object_list = []
    const $html2 = $html.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    const _topic_cfp_conf = $($html2).find(".linklist")
    const _cfp = _topic_cfp_conf[$deadOrComing]
    const _list_cfp = $(_cfp).find("li a")
    for (var i = _list_cfp.length - 1; i >= 0; i--) {
        const _detail_url = $(_list_cfp[i]).attr('href')
        const _common = _list_cfp[i].innerText.split("(deadline:")
        const _deadline = _common[1] // 締切
        const _date_name_place=_common[0].split(",")
        const _conf_name_place = () => {
            if (_date_name_place.length === 1) {
                return {
                    date:"",
                    name: _date_name_place[0],
                    place: ""
                }
            } else if  (_date_name_place.length === 2) {
                    return {
                        date: _date_name_place[0],
                        name: _date_name_place[1],
                        place: ""
                    }
            } else if  (_date_name_place.length === 3) {
                    return {
                        date: _date_name_place[0],
                        name: _date_name_place[1],
                        place: _date_name_place[2]
                    }
            }else{
                const last1 = _date_name_place.length 
                const last2 = _date_name_place.length - 1
                const last3 = _date_name_place.length - 2
                const dnp1 = _date_name_place.slice(1,last2)
                const dnp2 = _date_name_place.slice(1,last3)
                // console.log("dnp2",dnp2)
                if(dnp2.join(",").slice(-1)===")"){
                    return {
                        date:_date_name_place[0],
                        name: dnp2.join(","),
                        place: _date_name_place.slice(last3,last1).join(","),
                }
                }else{
                    return {
                        date:_date_name_place[0],
                        name: dnp1.join(","),
                        place: _date_name_place.slice(last2)
                }   
                }
            }
        }
        _object_list[i] = {
            detail_url: _detail_url,
            conf_date: formatDate2(_conf_name_place().date),
            conf_name: _conf_name_place().name,
            conf_place: _conf_name_place().place,
            deadline: formatDate2(_deadline)
        }
    }
    return _object_list
}


function formatDate2($date: string): string {
    if ($date !== undefined && $date !== "") {
        const aaa = $date
            .replace("Monday", "")
            .replace("Tuesday", "")
            .replace("Wednesday", "")
            .replace("Thursday", "")
            .replace("Friday", "")
            .replace("Saturday", "")
            .replace("Sunday", "")
            .split(" ")
            .filter(x => x !== "")
            .filter(x => x !== "\n")
            .filter(x => x !== ")\n")
        const _year = aaa[aaa.length - 1]
            .replace(")", "")
            .replace("20", "'")
        const bbb = (aaa
                    .slice(0,aaa.length-1)
                    .join(" ")
                    .split(")")
                    .slice(-1)
                    )[0]
                    .split("-")
                    .map(x=>x
                        .split(" ")
                        .filter(x => x !== "")
                        ) // [xx[20,undefined],yy[1,June]]
        const fff = ()=>{
            const xx = bbb[0]
            const yy = bbb[1]
            if (bbb.length===1){
                return `${replaceMonth2num(xx[1])}/${xx[0]}`
            }else if (bbb.length===2){
                if (xx.length===1){
                 return  `${replaceMonth2num(yy[1])}/${xx[0]} - ${yy[0]}`
                } else if (xx.length==2){
                 return `${replaceMonth2num(xx[1])}/${xx[0]} - ${replaceMonth2num(yy[1])}/${yy[0]}`
                }
            }
        }
        const _info = () => {
            aaa.pop()
            aaa.pop()
            const bbb = aaa.join("").split(")")
            if (bbb.length === 1) {
                return ""
            } else {
                return `<br><span style="color:red;">${bbb[0]})</span>`
            }
        }
        // return `${_year}/${_month}/${_info()}`
        return `${fff()}${_info()}`
        // return `${fff()}`
    } else {
        return ""
    }
}

function replaceMonth2num ($num:string):string{
    if ($num===undefined){
        return "error"
    }else{
    return  $num
            .replace("January", "01")
            .replace("February", "02")
            .replace("March", "03")
            .replace("April", "04")
            .replace("May", "05")
            .replace("June", "06")
            .replace("July", "07")
            .replace("August", "08")
            .replace("September", "09")
            .replace("October", "10")
            .replace("November", "11")
            .replace("December", "12")
}
}

