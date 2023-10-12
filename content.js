// This script is injected into web pages

// Listen for mouseup events (text selection)

document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString();
  const calculateButton = document.getElementById("calculateButton");


  // chrome.runtime.sendMessage({ expression: selectedText }, function (result) {
  //       alert(`Result: ${result}`);
  //     });
  //   // Enable the "Calculate" button if there's selected text
  // if (selectedText) {
  //       calculateButton.addEventListener("click",function(){
  //     alert("HI");
  //     chrome.runtime.sendMessage({ expression: selectedText }, function (result) {
  //       alert(`Result: ${result}`);
  //     });
  //   });
  // }
});


