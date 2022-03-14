var regularStartTime = 8;
var regularEndTime = 18;
var calendarArea = $(".container");
var tasks = [];
//Loading tasks from local storage.
loadTasks = function(){
    if(localStorage.getItem("schedulerTasks")){
    var tasks = localStorage.getItem("schedulerTasks");
        return JSON.parse(tasks);
    }
    else 
    return [];
}
tasks = loadTasks();
//Loading single task for displaying on scheduler per each block
loadTask = function(hour) {
    var taskText = undefined;
    tasks.forEach(function(object){ 
        if(object.hour == hour){
             taskText= object.taskText;
        }
    });
    return taskText;
}

//Creating a single task time block while initial loading
createTaskInTimeBlock = function(hour){
      var tasktext = loadTask(hour);
      if(tasktext){
          var taskTextEl = $("<textarea>").addClass("textarea col-12");
          taskTextEl.text(tasktext);
          return taskTextEl;
      }
      return 0;
}

//Appending blcoks for core hours in calendar container area
appendBlocks = function (hour) {
    //Full ROw
    var hourEl = $("<div>").addClass("row");
    hourEl.attr("data-hour", hour);
    //TO Display time
    var displayHour = $("<div>").addClass("hour d-flex align-items-center justify-content-center col-1");
    //to store task
    var timeBlock = $("<div>").addClass("time-block d-flex align-items-center col-10");
    //Checking for existing tasks in localStorage
    var currentTask = createTaskInTimeBlock(hour);
    if(currentTask){
        timeBlock.append(currentTask);
    }
    //Save Button
    var saveButton = $("<div>").addClass("saveBtn d-flex align-items-center justify-content-center col-1");
    displayHour.text( moment(moment.duration(hour, "hours").asHours(), "hh").format('h A'));
    saveButton.append('<i class="bi-save-fill"></i>');
    hourEl.append(displayHour);
    hourEl.append(timeBlock);
    hourEl.append(saveButton);
    auditHour(hourEl);
    calendarArea.append(hourEl);
};

//Checking each hour block for color codings
auditHour = function (hourEl) {
    var hourOfTheElement = $(hourEl).attr("data-hour");
    var currentHour = moment().hour();
    if (hourOfTheElement > currentHour) {
        $(hourEl).children('.time-block').addClass("future");
    }
    else if (hourOfTheElement < currentHour) {
        $(hourEl).children('.time-block').addClass("past");
    }
    else {
        $(hourEl).children('.time-block').addClass("present");
    }
}
//Setting current date and time on jumbotran
$("#currentDay").text(moment().format("dddd, MMMM Do YYYY"));
for (var i = regularStartTime; i < regularEndTime; i++) {
    appendBlocks(i);
}
//adding click event to time blocl
$('.time-block').on("click", function () {
//If task already exist, edit current task, otherwise create new one.
    if ($(this).has('.textarea').length) {
        $(this).children('.textarea').focus();
    } else {
        var taskText = $("<textarea type='textarea'>");
        taskText.addClass("textarea col-12");
        $(this).append(taskText);
        $(this).children(0).focus();
    }
});
'Saving the entered text as text content'
$('.time-block').on("change","textarea", function(){
    $(this).text($(this).val());
});
//Saving current task information to localStorage.
$('.saveBtn').on("click", function () {
    var parentTag = $(this).parent();
    if(parentTag.has('textarea').length){
        var tasktext = parentTag.children('.time-block').children('textarea').text();
        var hour = parentTag.attr("data-hour");
        saveTasks(tasktext,hour);
    }
});

//SAving tasks to local storage.
saveTasks = function(taskText, hour){
    tasks.push({"hour": hour, taskText: taskText});
    localStorage.setItem("schedulerTasks",JSON.stringify(tasks));
}

setTimeout(function(){
    var currentHour = moment().hour();
    if(currentHour ==0){
    localStorage.removeItem("schedulerTasks");
    }
},1000*60*60);