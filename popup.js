// This script handles the popup behavior

document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculateButton");
  const selectedExpression = document.getElementById("selectedExpression");
  const resultElement = document.getElementById("result");

  // Listen for the "Calculate" button click
  calculateButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: getSelectedText,
      },
      (selectedText) => {
        selectedExpression.textContent = "Selected Expression: ".concat(((selectedText)));
        try {
          const result = calculateSelectedExpression(selectedText);
          resultElement.textContent = `Result: ${result}`;
        } catch (error) {
          resultElement.textContent = "Error: Invalid expression"+error;
          alert(selectedText);
        }
      }
    );
    });
  });


});

// Function to calculate the selected expression
function calculateSelectedExpression(selectedText) {

  var selectedTex = JSON.stringify(selectedText).toString().trim();
  // return selectedTex;
  console.log(selectedTex);
  var selectedTex = selectedTex.replace(/[^0-9+\-*Xx/.]/g, '');

  const sanitizedText = selectedTex;
  const operators = [ "+", "-","/","*","x","X" ];
  var evaluatedExpression=0;
  var lst=sanitizedText;
  var val1=0,val2=0,prev=0;
  var op='+';
  var i=0;
  while (i<lst.length){
    if(lst[i]!=" "){
      if (operators.includes(lst[i])){
        prev=1;
        op=lst[i];
        i+=1
      }
      else{
        // val2=0
        if(prev){
          //   while(lst[i]>='0' && lst[i]<='9'){
          //   val2=val2*10+lst[i]*1;
          //   i++;
          // }
          val2=lst[i]*1;
          val1=evaluateExp(val1,val2,op);
          prev=0;
          i+=1;
        }
        else{
          // val1=0
          //   while(lst[i]>='0' && lst[i]<='9'){
          //   val1=val1*10+lst[i]*1;
          //   i++;
          // }
          val1=lst[i]*1;
          i++;
        }
      }
    }
    else{
      i+=1
    }
    // i+=1;
    evaluatedExpression=val1;
  }
 
  return evaluatedExpression;
}

function evaluateExp(val1,val2,op){
  if(op=='+'){
    return val1+val2;
  }
  else if(op=='-' || op=='--'){
    return val1-val2;
  }
  else if(op=='/'){
    return val1/val2;
  }
  else if (op=='*' || op=='X' || op=='x'){
    return val1*val2;
  }
}

function getSelectedText() {
  return window.getSelection().toString();
}