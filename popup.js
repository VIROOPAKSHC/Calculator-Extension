// This script handles the popup behavior

document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculateButton");
  const resultElement = document.getElementById("result");
  const inputElement = document.getElementById("input");
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
        var sel=0;
        if(inputElement.value){
          selectedText=inputElement.value;
          
        }
        else{
          inputElement.value=JSON.parse(JSON.stringify(selectedText).substr(1,JSON.stringify(selectedText).length-2).toString()).result ;
          sel=1;
        }
        
        try {
          const result = calculateSelectedExpression(selectedText,sel);
          resultElement.textContent = `= ${result}`;
        } catch (error) {
          resultElement.textContent = "Error: Invalid expression"+error;
      
        }
      }
    );
    });
  });


});

// Function to calculate the selected expression
function calculateSelectedExpression(selectedText,flag) {
  if(flag){
    var selectedTex = JSON.parse(JSON.stringify(selectedText).substr(1,JSON.stringify(selectedText).length-2).toString()).result.trim();
  }
  else{
    var selectedTex=selectedText.trim();
  }

  var selectedTex = selectedTex.replace(/[^0-9+\-*Xx/.]/g, '');
 

  const sanitizedText = selectedTex;
  const operators = [ "+", "-","/","*","x","X" ];
  var evaluatedExpression=0;
  var lst=sanitizedText;
  var val1=0,val2=0,prev=0;
  var op='+';
  var i=0;
  var neg=0;
  while (i<lst.length){
    while(i<lst.length && lst[i]>='0' && lst[i]<='9'){
      if(prev){
        val2=val2+lst[i];
      }
      else{
        val1=val1+lst[i];
      }
      i+=1;
    }

    if(prev){
      val2=val2*1;
      if(neg){
        val2=val2*(-1);
        neg=0;
        console.log("Negative -"+val2);
      }
      console.log(val1,val2,op);
      val1=evaluateExp(val1,val2,op);
      prev=0;
      val2=0;
    }
    else{
      val1=val1*1;
      if(neg){
        val1=val1*(-1);
        neg=0;
        console.log("Negative -"+val1);
      }
    }
    if(operators.includes(lst[i])){
      if(i>0 && !(operators.includes(lst[i+1])))
      {
        prev=1;
        op=lst[i];  
      }
      else{
        prev=1;
        if(lst[i+1]=='-'){
          neg=1;
          op=lst[i];
          i+=1;

        }
        else{
          return "Invalid Expression";
        }
      }
    }
    i+=1;
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
