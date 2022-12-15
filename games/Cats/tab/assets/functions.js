function checkUsername () {

  var input = document.getElementById("username_input");
  var button = document.getElementById("play_button");

  input.value = input.value.replace(/\s+/g, '');

  if (input.value.length < 3 && !button.classList.contains("disabled"))
    button.classList.add("disabled");
  else if (input.value.length > 2 && button.classList.contains("disabled"))
    button.classList.remove("disabled");

}  
