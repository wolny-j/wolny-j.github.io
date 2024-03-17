import { useEffect, useState } from "react";
import "../CSS/gameContent.css";
import { anagrams } from "./anagramList";


const KEY_BACKSPACE = "Backspace";
const KEY_DELETE = "Delete";

function GameContent() {
    const [correctAnagramsArray, setCorrect] = useState<string[]>([])
    const [word, setWord] = useState<string>('');
    const [counter, setCounter] = useState<number>(0);
    const [pool, setPool] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [pressedKey, setPressedKey] = useState<string | null>(null);
    const [keyPressed, setKeyPressed] = useState<boolean>(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
    const [answeredWords, setAnsweredWords] = useState<string[]>([]);
    const [progress, setProgress] = useState<string[]>();



    // Effect to save progress in cookies on progress variable change
    useEffect(() => {
        if (progress != undefined && progress.length > 0) {
            setCookie('progress', JSON.stringify(progress), 90);
        }
    }, [progress]);

    // Effect to load progress from cookies on website load
    useEffect(() => {
        const savedProgress = getCookie('progress');
        if (savedProgress) {
            setProgress(JSON.parse(savedProgress));
        }
    }, []);

    // Function to handle key presses
    useEffect(() => {
        if (keyPressed == true) {
            setKeyPressed(false);
            setPool((prevPool) => {
                if (pressedKey === null) {
                    return " ";
                }
                else if (/^[a-zA-Z]$/.test(pressedKey) && counter / 2 <= word.length - 1) {
                    setCounter((prevCounter) => prevCounter + 2);
                    const updatedPool = prevPool.substring(0, counter) + pressedKey + prevPool.substring(counter + 1);
                    setAnswer(answer + pressedKey);
                    return updatedPool;
                }
                else if (pressedKey === KEY_BACKSPACE) {
                    if (counter > 0) {
                        setCounter(counter - 2);
                        const updatedPool = prevPool.substring(0, counter - 2) + "_ " + prevPool.substring(counter);
                        setAnswer(answer.slice(0, -1)); // Usuń ostatnią literę z answer
                        return updatedPool;
                    }
                }
                else if (pressedKey == KEY_DELETE) {
                    setCounter(0);
                    setAnswer("");
                    setPool(prevPool => {
                        let updatedPool = '';
                        for (let i = 0; i < word.length; i++) {
                            updatedPool += '_ ';
                        }
                        return updatedPool;
                    });
                }

                return pool;
            });
        }
    }, [keyPressed]);

     // Function to check if the answer is correct on answer wariable is changed
     useEffect(() => {
        if (answer.length === word.length || answer.length === 0) {
            const isCorrect = correctAnagramsArray.slice(1).some(anagram => anagram.toLowerCase() === answer);
            setIsCorrectAnswer(isCorrect);
        }
    }, [answer]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);


    // Effect to handle key presses
    const handleKeyPress = (event: KeyboardEvent) => {
        setKeyPressed(true);
        setPressedKey(event.key);
    };

    // Function to handle click event
    const handleClick = () => {
        // Reset state
        setPool(' ');
        setAnswer("");
        setAnsweredWords([]);
        setCounter(0);

        // Generate a new word
        let randomInt = getRandomInt(anagrams.length);
        let newWord: string = anagrams[randomInt][0];

        // Ensure the word hasn't been answered before
        while (progress?.includes(newWord)) {
            randomInt = getRandomInt(anagrams.length);
            newWord = anagrams[randomInt][0];
        }

        // Update state with the new word
        setWord(newWord);
        setCorrect(anagrams[randomInt]);

        // Reset the pool with underscores
        setPool(prevPool => '_ '.repeat(newWord.length));
    };

    // Function to check if a word should be displayed as an answer or not
    const checkToDisplay = (word: string) => {
        if (isCorrectAnswer && word === answer && !answeredWords.includes(word)) {
            // Update progress if all words are answered
            if (answeredWords.length == correctAnagramsArray.length - 2) {
                setProgress(prevProgress => [...(prevProgress || []), correctAnagramsArray[0]]);
            }

             // Update state
            setAnsweredWords([...answeredWords, answer]);
            setCounter(0);
            setAnswer("");
            setPool(prevPool => '_ '.repeat(word.length));

            return "answer";
        }
        else if (answeredWords.includes(word)) {
            return "answer";
        }
        else {
            return "notAnswer";
        }

    }

    // Function to render counter
    const renderCounter = () => {
        if (correctAnagramsArray.length == 0) {
            return "invisibleCounter";
        }
        else {
            return "counter";
        }
    }

    //HTML code
    return (
        <div className="gameContainer">
            <p className="counter2">
                {progress !== undefined ? progress.length + "/" + anagrams.length : "0" + "/" + anagrams.length}
            </p>
            <div className="buttonsContainer">
                <button type="button" onClick={handleClick} className="resetButton">
                    Generate word
                </button>
            </div>
            <p className="gameText">
                {word}
            </p>
            <p className={renderCounter()}>
                {answeredWords.length + "/" + (correctAnagramsArray.length - 1)}
            </p>
            <p className="gameText">
                {pool}
            </p>
            <div className="gridContainer">
                {correctAnagramsArray.map((row) => (
                    <div className={checkToDisplay(row)}>
                        {row}
                    </div>))}

            </div>
        </div>

    )
}


//Setup cookie on browser
function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    const sameSite = ";SameSite=None";
    const secure = ";Secure";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + sameSite + secure;
}

//Load cookie from browser
function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Generates random int with range 0 to number given
function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export default GameContent;
