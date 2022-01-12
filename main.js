
function onConnectionLost() {
  console.log("connection lost");
  if(page == "admin"){
    document.getElementById("status").innerHTML = "Connection Lost";
    document.getElementById("status_messages").innerHTML =
      "Connection Lost";
    document.getElementsByName("conn")[0].disabled = false
  }
  connected_flag = 0;
  onFailure()
  // setTimeout(MQTTconnect, reconnectTimeout);
}
function onFailure(message) {
  console.log("Failed");
  if(page == "admin"){
    document.getElementById("status_messages").innerHTML =
    "Connection Failed- Retrying";
  }
  setTimeout(MQTTconnect, reconnectTimeout);
}
function onMessageArrived(r_message) {
  bbcodetohtml = r_message.payloadString.replace(/(\[((\/?)(pre|ol|li|ul|code|br|b|u|i|s|sub|sup|table|tr|td|th|h1|h2|h3|h4|h6|p))\])/gi, '<$2>');
  bbcodetohtml = bbcodetohtml.replace(/\[url\](.*?)\[\/url\]/ig, '<a href="$1">$1</a>');
  bbcodetohtml = bbcodetohtml.replace(/\[url=(.*?)\](.*?)\[\/url\]/ig, '<a href="$1">$2</a>');
  bbcodetohtml = bbcodetohtml.replace(/\[quote\](.*?)\[\/quote\]/ig, '<blockquote>$1</blockquote>');
  bbcodetohtml = bbcodetohtml.replace(/\[img\](.*?)\[\/img\]/ig, '<img src="$1"/>');
  bbcodetohtml = bbcodetohtml.replace(/\[size=(.*?)\](.*?)\[\/size\]/ig, '<span style="font-size: $1px">$2</span>');
  bbcodetohtml = bbcodetohtml.replace(/\[font=(.*?)\](.*?)\[\/font\]/ig, '<span style="font-family: $1">$2</span>');
  bbcodetohtml = bbcodetohtml.replace(/\[color=(.*?)\](.*?)\[\/color\]/ig, '<font color="$1">$2</font>');
  bbcodetohtml = bbcodetohtml.replace(/\[center\](.*?)\[\/center\]/ig, '<div style="text-align:center;">$1</div>');
  bbcodetohtml = bbcodetohtml.replace(/\[left\](.*?)\[\/left\]/ig, '<div style="text-align:left;">$1</div>');
  bbcodetohtml = bbcodetohtml.replace(/\[right\](.*?)\[\/right\]/ig, '<div style="text-align:right;">$1</div>');
  bbcodetohtml = bbcodetohtml.replace(/\[youtube\](.*?)\[\/youtube\]/ig, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
  //       out_msg = "Message received " + bbcodetohtml;
  // console.log(bbcodetohtml)
  //       out_msg = out_msg + "      Topic " + r_message.destinationName + "<br/>";
    out_msg = bbcodetohtml
    // out_msg = "<b>" + out_msg + "</b>";
    //console.log(out_msg+row);
    try {
      document.getElementById("out_messages").innerHTML += out_msg;
    } catch (err) {
      document.getElementById("out_messages").innerHTML = err.message;
    }

    if (row == 10) {
      row = 1;
      document.getElementById("out_messages").innerHTML = out_msg;
    } else row += 1;

    mcount += 1;
    // console.log(mcount + "  " + row);                                  
}

function onConnected(recon, url) {
  console.log(" in onConnected " + reconn);
}
function unsubscrib(topic){
  mqtt.unsubscribe(topic);
  delete obdata.topic[topic];
  // data["topic"]=obdata.topic
  document.cookie = "data="+JSON.stringify(obdata)+"; expires=Thu, 18 Dec 2030 12:00:00 UTC";
  loadsubscribe(false)
}
function loadsubscribe(subscribe){
  if(typeof obdata !="undefined" && typeof obdata.topic !="undefined"){
    var html ="";
    for(var key in obdata.topic){
      if(page == "admin"){
        html +=`<li class="subLine">
          <div class="row large-12 subs1">
              <div class="large-12 columns subText">
                  <div class="large-1 columns right closer"><a href="#" onclick="unsubscrib('`+key+`'); return false;">x</a></div>
                  <div class="qos">Qos:`+obdata.topic[key]+`</div>
                  <div class="topic truncate" title="`+key+`">`+key+`</div>
              </div>
          </div>
      </li>`
      }
      if(subscribe){
        mqtt.subscribe(key, {qos:obdata.topic[key]});
      }
    }
    if(page == "admin"){
      document.getElementById("innerEdit").innerHTML=html
    }
  }
}
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  if(page == "admin"){
    document.getElementsByName("conn")[0].disabled = true
    document.getElementById("status_messages").innerHTML =
      "Connected to " + host + "on port " + port;
    connected_flag = 1;
    document.getElementsByName("discon")[0].disabled = false
    // mqtt.subscribe('ff', soptions);
    document.getElementById("status").innerHTML = "Connected";
    console.log("on Connect " + connected_flag);
  }
  loadsubscribe(true)
}
function disconnect() {
  if (connected_flag == 1) mqtt.disconnect();
  document.getElementsByName("conn")[0].disabled = false
  document.getElementsByName("discon")[0].disabled = true
}

function MQTTconnect(flag = false) {
  var cname, user_name, password, clean_sessions ;
  if(page == "admin"){
    clean_sessions = document.forms["connform"]["clean_sessions"].value;
    user_name = document.forms["connform"]["username"].value;
    password = document.forms["connform"]["password"].value;
    if ((clean_sessions =document.forms["connform"]["clean_sessions"].checked))
      clean_sessions = true;
    else clean_sessions = false;
    document.getElementById("status_messages").innerHTML = "";
    var s = document.forms["connform"]["server"].value;
    var p = document.forms["connform"]["port"].value;
    if (p != "") {
      port = parseInt(p);
    }
    if (s != "") {
      host = s;
      // console.log("host");
    }
    // console.log(
    //   "connecting to " +
    //     host +
    //     " " +
    //     port +
    //     "clean session=" +
    //     clean_sessions
    // );
    document.getElementById("status_messages").innerHTML = "connecting";
    cname = document.forms["connform"]["clientid"].value
    // data['user_name']=user_name;
    // data['password']=password;
    // data['clean_sessions']=clean_sessions
    // data['server']=s
    // data['port']=p
    // data['clientid']=document.forms["connform"]["clientid"].value
    obdata['user_name']=user_name;
    obdata['password']=password;
    obdata['clean_sessions']=clean_sessions
    obdata['server']=s
    obdata['port']=p
    obdata['clientid']=document.forms["connform"]["clientid"].value
    document.cookie = "data="+JSON.stringify(obdata)+"; expires=Thu, 18 Dec 2030 12:00:00 UTC";
    // if(flag){
    //   document.cookie = "data="+JSON.stringify(data)+"; expires=Thu, 18 Dec 2030 12:00:00 UTC";
    // }
  }else{
    if(typeof obdata != "undefined"){
      cname = obdata.clientid
      clean_sessions = obdata.clean_sessions
      user_name = obdata.user_name
      password = obdata.password
    }
  }

  console.log(host+port+cname)
  mqtt = new Paho.MQTT.Client(host, port, cname);
  var options = {
    timeout: 3,
    cleanSession: clean_sessions,
    onSuccess: onConnect,
    onFailure: onFailure
  };
  options.userName = user_name;
  options.password = password;
  console.log(options)
  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.onConnected = onConnected;
  mqtt.connect(options);
  return false;
}
var obtopic = {}
function sub_topics() {
  console.log(obdata)
  document.getElementById("status_messages").innerHTML = "";
  if (connected_flag == 0) {
    out_msg = "<b>Not Connected so can't subscribe</b>";
    console.log(out_msg);
    document.getElementById("status_messages").innerHTML = out_msg;
    return false;
  }
  var stopic = document.forms["subs"]["Stopic"].value.trim();
  if(stopic.length==0){
    alert("Please input value Topic !");
    return;
  }
  // console.log("here");
  var sqos = parseInt(document.forms["subs"]["sqos"].value);
  if (sqos > 2) sqos = 0;
  // console.log("Subscribing to topic =" + stopic + " QOS " + sqos);
  document.getElementById("status_messages").innerHTML =
    "Subscribing to topic =" + stopic;
  var soptions = {
    qos: sqos,
  };
  obtopic[stopic]=sqos
  console.log(obdata.topic)
  if (typeof obdata.topic != "undefined"){
    obtopic = Object.assign({}, obdata.topic, obtopic);
  }
  // data["topic"]=obtopic
  // obdata["topic"]=obtopic
  // obdata['topic']=obtopic
  obdata.topic=obtopic
  document.cookie = "data="+JSON.stringify(obdata)+"; expires=Thu, 18 Dec 2030 12:00:00 UTC";
  mqtt.subscribe(stopic, soptions);
  loadsubscribe(false)
  return false;
}
function send_message() {
  document.getElementById("status_messages").innerHTML = "";
  if (connected_flag == 0) {
    out_msg = "<b>Not Connected so can't send</b>";
    // console.log(out_msg);
    document.getElementById("status_messages").innerHTML = out_msg;
    return false;
  }
  var pqos = parseInt(document.forms["smessage"]["pqos"].value);
  if (pqos > 2) pqos = 0;
  var msg = document.forms["smessage"]["message"].value;
  // console.log(msg);
  document.getElementById("status_messages").innerHTML =
    "Sending message  " + msg;

  var topic = document.forms["smessage"]["Ptopic"].value;
  //var retain_message = document.forms["smessage"]["retain"].value;
  if (document.forms["smessage"]["retain"].checked) retain_flag = true;
  else retain_flag = false;
  message = new Paho.MQTT.Message(msg);
  if (topic == "") message.destinationName = "test-topic";
  else message.destinationName = topic;
  message.qos = pqos;
  message.retained = retain_flag;
  mqtt.send(message);
  return false;
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
window.onload = function() {
  strdata = getCookie('data')
  if (typeof strdata != "undefined"){
    obdata = JSON.parse(strdata)
    if(page=="admin"){
      document.getElementsByName("server")[0].value=obdata.server
      document.getElementsByName("port")[0].value=obdata.port
      document.getElementsByName("clientid")[0].value=obdata.port
      // obdata.clean_sessions?"": document.getElementsByName("clean_sessions")[0].checked = false;
      document.forms["connform"]["clientid"].value = obdata.clientid
      obdata.user_name?document.forms["connform"]["username"].value = obdata.user_name:""
      obdata.password?document.forms["connform"]["password"].value = obdata.password:""
    }
    MQTTconnect()
  }else{
    if(page=="admin"){
      document.forms["connform"]["clientid"].value='mqttjs_' + Math.random().toString(16).substr(2, 8)
    }
  }
 
 
  // MQTTconnect()
};