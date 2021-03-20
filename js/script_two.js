var taskInput = document.getElementById("task");
var taskList = document.getElementById("task-list");
var ENTER_KEY_CODE = 13;
var STATUS_OK = 200;
var taskTemplate = document.getElementById("task-template");
var renderTaskTemplate = Handlebars.compile(taskTemplate.innerHTML);
var template = document.getElementById("template");
var renTaskTemplate = Handlebars.compile(template.innerHTML);
var taskInput = document.getElementById("task");
var taskList = document.getElementById("task-list");
var li_arr = [];

// -----------------retrieve data from server on page load-------------------------------

function getData() 
{
  var request = new XMLHttpRequest();    //request sending to get all tasks in tasklist
  request.open("GET","/tasks.txt");
  request.send();
  request.addEventListener("load", function(event)
  {
    var output = JSON.parse(event.target.responseText);
    if (output === null) return;
    output.forEach(function (task)
    {
      var li = document.createElement("li");
      li.innerHTML = renderTaskTemplate({ task: task.text });
      li.setAttribute("id", task.text);
      var request_check = new XMLHttpRequest(); //request sending to get checked or mark tasks in tasklist
      request_check.open("GET","/check.txt");
      request_check.send();
      request_check.addEventListener("load", function(event)
      {
        var output_check = JSON.parse(event.target.responseText);
        if (output_check === null) return;
        output_check.forEach(function (chk)
        {
          if(task.text === chk.check)
          {
            li.setAttribute("class","checked");
            li.innerHTML = renTaskTemplate({ task: chk.check });
            
          }
        });
      });
      taskList.appendChild(li);
    });
  });
}

// ----------------- Store data into file and add task into view page tasklist----------------

taskInput.addEventListener("keydown", function (event) 
{
  if (event.keyCode === ENTER_KEY_CODE)
  {
    event.preventDefault();
    if(taskInput.value)
    {
      var request = new XMLHttpRequest();
      request.open("POST","/tasks");
      var obj ={text : taskInput.value};
      request.send(JSON.stringify(obj));
      addTaskToList();        // function to add todo
    }
  }
});

// ---------------------- used for checked or unchecked or delete todo --------------------

taskList.addEventListener("click", function (event) 
{
  var target = event.target;
  var li = target.parentNode;
  if (target.classList.contains("check")) 
  {
    event.preventDefault();
    if (li.classList.contains("checked"))   // if checked then make unchecked
    {
      li.classList.remove("checked");
      target.innerHTML = "&#9744;";
      var request = new XMLHttpRequest();      //request for making check to uncheck
      request.open("GET","/check.txt");
      request.send();
      request.addEventListener("load", function(event)
      {
        var output = JSON.parse(event.target.responseText);
        if (output === null) return;
        output.forEach(function (task)
        {
          if(task.check === li.id)
          {
          output = output.filter((el) => el !== task);
          }
        });
        var request = new XMLHttpRequest();
        request.open("PUT","/check");
        request.send(JSON.stringify(output));
      });
    } 
    else 
    {
      li.classList.add("checked");    // if unchecked then make checked
      target.innerHTML = "&#9745;";
      var request = new XMLHttpRequest();      //request for making uncheck to check
      request.open("POST","/check");
      console.log(li.id);
      var obj ={check : li.id};
      request.send(JSON.stringify(obj));
    }
  } 
  else if (target.classList.contains("delete")) 
  {
    event.preventDefault();
    li.parentNode.removeChild(li);
    var request = new XMLHttpRequest();    //request for deleting todo
    request.open("GET","/tasks.txt");
    request.send();
    request.addEventListener("load", function(event)
    {
      var output = JSON.parse(event.target.responseText);
      console.log(output);
      if (output === null) return;
      output.forEach(function (task)
      {
        console.log(task.text, li.id);
        if(task.text === li.id)
        {
          console.log("mein chla",task);
          output = output.filter((el) => el !== task);
        }
      });
      console.log(output);
      var request = new XMLHttpRequest();
      request.open("PUT","/tasks");
      request.send(JSON.stringify(output));
    });
	  var request = new XMLHttpRequest();
    request.open("GET","/check.txt");
    request.send();
    request.addEventListener("load", function(event)
    {
      var output = JSON.parse(event.target.responseText);
      if (output === null) return;
      output.forEach(function (task)
      {
        if(task.check === li.id)
        {
         output = output.filter((el) => el !== task);
        }
      });
    var request = new XMLHttpRequest();
    request.open("PUT","/check");
		request.send(JSON.stringify(output));
    });
  }
});

// ------------------ function to add todo ------------------

function addTaskToList() 
{
  if (taskInput.value) 
  {
  var li = document.createElement("li");
  li.innerHTML = renderTaskTemplate({ task: taskInput.value });
  taskList.appendChild(li);
	li.setAttribute("id",taskInput.value);
  taskInput.value = "";
  }
}

getData();       // paste all saved data on page load