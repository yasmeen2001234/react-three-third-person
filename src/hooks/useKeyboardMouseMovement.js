import { useState, useEffect } from "react";
import nipplejs from "nipplejs";


const defaultMap = {
  up: "w",
  down: "s",
  right: "d",
  left: "a",
  jump: " ",
  run: "e",
};
var manager=null;



const options = {
  zone: document.getElementById('joystickWrapper1'),
  size: 150,
  multitouch: true,
  maxNumberOfNipples: 1,
  mode: 'static',
  restJoystick: true,
  zIndex: 9999,
  shape: 'circle',
  color: 'linear-gradient(to bottom, #ce09ff, #ffa34e)',
  position: { bottom: '0px', left: '0px' },
  dynamicPage: true,
  
};

const div = document.createElement("div");
div.id = "zone_button";
document.body.appendChild(div);

const button = document.createElement("button");
button.id = "button";
div.appendChild(button);
const text = document.createElement("jumpingbutton");
text.id = "JUMP";

text.innerHTML = "JUMP";

button.appendChild(text);

div.style.display = "none";
 manager= nipplejs.create(options);

// Set color gradient of joystick
const joystickElement = document.querySelector('.nipple');
joystickElement.style.backgroundImage = 'linear-gradient(to bottom, #ff0000, #0000ff)';




const getInputFromKeyboard = (keyMap, keyPressed) => {
  let inputFound = "";
  Object.entries(keyMap).forEach(([k, v]) => {
    if (v === keyPressed) {
      inputFound = k;
    }
  });
  return inputFound;
};

export default function useKeyboardInput(inputManager, userKeyMap = {}) {
  const [isMouseLooking, setIsMouseLooking] = useState(false);
  const [inputsPressed, setInputsPressed] = useState({});
  const keyMap = {
    ...defaultMap,
    ...userKeyMap,
  };

  function downHandler({ key }) {
    const input = getInputFromKeyboard(keyMap, key);
    if (input) {
      setInputsPressed((prevState) => ({
        ...prevState,
        [input]: true,
      }));
    }
  }

  const upHandler = ({ key }) => {
    const input = getInputFromKeyboard(keyMap, key);
    if (input) {
      setInputsPressed((prevState) => ({
        ...prevState,
        [input]: false,
      }));
    }
  };

  function pointerdownHandler({ button }) {
    if (button === 2) {
      setIsMouseLooking(true);
    }
  }

  const pointerupHandler = ({ button }) => {
    if (button === 2) {
      setIsMouseLooking(false);
    }
  };
   manager?.on("move", function (evt, data) {
     if (
       data?.direction?.y === "up" &&
       data?.angle.degree > 45 &&
       data?.angle.degree < 135
     ) {
     
if( data?.vector?.y >= 0.99 ) {
  setInputsPressed((prevState) => ({
    ...prevState,
    up: true,
    run : true,
    down: false,
    left:false,
    right:false
  })); }
  
  else {
    setInputsPressed((prevState) => ({
      ...prevState,
      up: true,
      down: false,
      run:false
    }));
  }

     }
     else if (
       data?.direction?.y === "down" &&
       data?.angle.degree > 225 &&
       data?.angle.degree < 315
     ) {
       setInputsPressed((prevState) => ({
         ...prevState,
         up: false,
         down: true,
       }));
     } else if (
       data?.direction?.x === "left" &&
       data?.direction?.y === "up" &&
       data?.angle.degree > 315 &&
       data?.angle.degree < 45
     ) {
       setInputsPressed((prevState) => ({
         ...prevState,
         up: true,
         down: false,
         left: true,
         right: false,
       }));
     } else if (
       data?.direction?.x === "left" &&
       data?.direction?.y === "down" &&
       data?.angle.degree > 135 &&
       data?.angle.degree < 225
     ) {
       setInputsPressed((prevState) => ({
         ...prevState,
         up: false,
         down: true,
         left: true,
         right: false,
       }));
     } else if (
       data?.direction?.x === "right" &&
       data?.direction?.y === "up" &&
       data?.angle.degree > 45 &&
       data?.angle.degree < 135
     ) {
       setInputsPressed((prevState) => ({
         ...prevState,
         up: true,
         down: false,
         left: false,
         right: true,
       }));
     } else if (
       data?.direction?.x === "right" &&
       data?.direction?.y === "down" &&
       data?.angle.degree > 225 &&
       data?.angle.degree < 315
     ) {
       setInputsPressed((prevState) => ({
         ...prevState,
         up: false,
         down: true,
         left: false,
         right: true,
       }));
     } else if (
       data?.direction?.x === "left" &&
       data?.angle.degree > 135 &&
       data?.angle.degree < 225
     ) {
       setInputsPressed((prevState) => ({
         ...prevState,
         left: true,
         right: false,
       }));
     } else if (data?.direction?.x === "right") {
       setInputsPressed((prevState) => ({
         ...prevState,
         left: false,
         right: true,
       }));
     }
   });

   manager?.on("end", function (evt, data) {
     setInputsPressed((prevState) => ({
       ...prevState,
       up: false,
       down: false,
     }));

     setInputsPressed((prevState) => ({
       ...prevState,
       left: false,
       right: false,
     }));
   });
   document.addEventListener("click", function (event) {
     if (event.target.id === "button" || event.target.id === "JUMP") {
       setInputsPressed((prevState) => ({
         ...prevState,
         jump: true,
       }));
       setTimeout(() => {
         setInputsPressed((prevState) => ({
           ...prevState,
           jump: false,
         }));
       }, 1000);
     }
   });


  useEffect(() => {
    inputManager.subscribe("keydown", "character-controls", downHandler);
    inputManager.subscribe("keyup", "character-controls", upHandler);
    inputManager.subscribe(
      "pointerdown",
      "character-controls",
      pointerdownHandler
    );
    inputManager.subscribe("pointerup", "character-controls", pointerupHandler);

    return () => {
      inputManager.unsubscribe("keydown", "character-controls");
      inputManager.unsubscribe("keyup", "character-controls");
      inputManager.unsubscribe("pointerdown", "character-controls");
      inputManager.unsubscribe("pointerup", "character-controls");
    };
  }, []);

  return { ...inputsPressed, isMouseLooking };
}
