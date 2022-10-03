const addEventButton=document.getElementById('addEventButton');
const addEvent=document.getElementById('addEvent');
function showEvent(){
    if (addEvent.style.display=='block'){
        addEvent.style.display='none'
    }
    else{
        addEvent.style.display='block'
    }
}

const updateEventButton=document.getElementById('updateEventButton');
const updateEvent=document.getElementById('updateEvent');
function showUpdateEvent(){
    if (updateEvent.style.display=='block'){
        updateEvent.style.display='none'
    }
    else{
        updateEvent.style.display='block'
    }
}

const deleteEventButton=document.getElementById('deleteEventButton');
const deleteEvent=document.getElementById('deleteEvent');
function showDeleteEvent(){
    if (deleteEvent.style.display=='block'){
        deleteEvent.style.display='none'
    }
    else{
        deleteEvent.style.display='block'
    }
}