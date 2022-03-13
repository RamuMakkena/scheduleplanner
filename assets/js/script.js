var regularStartTime = 3;
var regularEndTime = 22;
var calendarArea = $(".container");

var tasks = [];


loadTasks = function(){
    if(localStorage.getItem("schedulerTasks")){
    var tasks = localStorage.getItem("schedulerTasks");
        // console.log(tasks);
        // console.log(JSON.parse(tasks));
        return JSON.parse(tasks);
    }
    else 
    return [];
}
tasks = loadTasks();

loadTask = function(hour) {
    var taskText = undefined;
    tasks.forEach(function(object){ 
        if(object.hour == hour){
             taskText= object.taskText;
        }
    });
    return taskText;
        
    
}

createTimeBlock = function(hour){
      var tasktext = loadTask(hour);
      console.log(tasktext);
      if(tasktext){
          var taskTextEl = $("<textarea>").addClass("textarea");
          taskTextEl.text(tasktext);
          return taskTextEl;
      }
      return 0;
}

appendBlocks = function (hour) {
    var hourEl = $("<div>").addClass("row");
    hourEl.attr("data-hour", hour);
    var displayHour = $("<div>").addClass("hour col-1");
    var timeBlock = $("<div>").addClass("time-block col-10");
    var currentTask = createTimeBlock(hour);
    console.log("current task is : "+currentTask)
    if(currentTask){
        timeBlock.append(currentTask);
    }
    var saveButton = $("<div>").addClass("saveBtn col-1");
    displayHour.append('<p>' + moment(moment.duration(hour, "hours").asHours(), "hh").format('h A') + '</p>');
    saveButton.append('<i class="bi-save-fill"></i>');
    hourEl.append(displayHour);
    hourEl.append(timeBlock);
    hourEl.append(saveButton);
    auditHour(hourEl);
    calendarArea.append(hourEl);
};


auditHour = function (hourEl) {
    var hourOfTheElement = $(hourEl).attr("data-hour");

    var currentHour = moment().hour();
    if (hourOfTheElement > currentHour) {
        $(hourEl).children(0).addClass("future");
    }
    else if (hourOfTheElement < currentHour) {
        $(hourEl).children(0).addClass("past");
    }
    else {
        $(hourEl).children(0).addClass("present");
    }
}
$("#currentDay").text(moment().format("dddd, MMMM Do YYYY"));
for (var i = regularStartTime - 2; i < regularEndTime + 2; i++) {
    appendBlocks(i);
}

$('.time-block').on("click", function () {
    //TO-DO need to enable a text area inside the timeblock  and save using save icon

    if ($(this).has('.textarea').length) {
        $(this).children('.textarea').focus();
    } else {
        var taskText = $("<textarea type='textarea'>");
        taskText.addClass("textarea");
        $(this).append(taskText);
        $(this).children(0).focus();
    }
});

$('.time-block').on("change","textarea", function(){
    $(this).text($(this).val());
});

$('.saveBtn').on("click", function () {
    var parentTag = $(this).parent();
    if(parentTag.has('textarea').length){
        var tasktext = parentTag.children('.time-block').children('textarea').text();
        console.log(tasktext);
        var hour = parentTag.attr("data-hour");
        console.log(hour);
        saveTasks(tasktext,hour);
    }
});


saveTasks = function(taskText, hour){
    console.log(taskText, hour);
    console.log(tasks);
    tasks.push({"hour": hour, taskText: taskText});
    localStorage.setItem("schedulerTasks",JSON.stringify(tasks));
}




/*
schedulerTasks = [{hour:0, task:"this is amazing"},{},{}]
*/
