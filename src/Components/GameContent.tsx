import { useEffect, useState } from "react";
import "../CSS/gameContent.css";
import { anagrams } from "./anagramList";
import { debug } from "util";

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

    useEffect(() => {
        if (keyPressed == true) {
            setKeyPressed(false);
            setPool((prevPool) => {
                if (pressedKey == null) {
                    return " ";
                }
                else if (/^[a-zA-Z]$/.test(pressedKey) && counter / 2 <= word.length - 1) {
                    setCounter((prevCounter) => prevCounter + 2);
                    const updatedPool = prevPool.substring(0, counter) + pressedKey + prevPool.substring(counter + 1);
                    setAnswer(answer + pressedKey);
                    return updatedPool;
                }
                else if (pressedKey === "Backspace") {
                    if (counter > 0) {
                        setCounter(counter - 2);
                        const updatedPool = prevPool.substring(0, counter - 2) + "_ " + prevPool.substring(counter);
                        setAnswer(answer.slice(0, -1)); // Usuń ostatnią literę z answer
                        return updatedPool;
                    }
                }
                else if (pressedKey == "Delete") {
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

    useEffect(() => {
        if (answer.length == word.length || answer.length == 0) {
            for (let i = 1; i <= correctAnagramsArray.length; i++) {
                console.log(answer + " " + correctAnagramsArray[i])
                if (answer === correctAnagramsArray[i]) {
                    setIsCorrectAnswer(true);
                    
                    break;
                } else {
                    setIsCorrectAnswer(false);
                }
            }
        }


    }, [answer]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);


    const handleKeyPress = (event: KeyboardEvent) => {
        setKeyPressed(true);
        setPressedKey(event.key);
    };

    const handleClick = () => {
        setPool(' ');
        setAnswer("");
        setAnsweredWords([]);
        setCounter(0);
        const randomInt = getRandomInt(anagrams.length)
        const word: string = anagrams[randomInt][0]
        setWord(word);
        setCorrect(anagrams[randomInt]);
        setPool(prevPool => {
            let updatedPool = '';
            for (let i = 0; i < word.length; i++) {
                updatedPool += '_ ';
            }
            return updatedPool;
        });
    };
    const checkToDisplay = (word: string) => {
        if(isCorrectAnswer && word === answer && !answeredWords.includes(word))
        {
            setAnsweredWords([...answeredWords, answer]);
            setCounter(0);
            setAnswer("");
            setPool(prevPool => {
                let updatedPool = '';
                for (let i = 0; i < word.length; i++) {
                    updatedPool += '_ ';
                }
                return updatedPool;
            });
            return "answer";
        }
        else if(answeredWords.includes(word)){
            return "answer";
        }
        else{
            return "notAnswer";
        }
        
    }

    const checkCounter = () => {
        if(correctAnagramsArray.length == 0)
        {
            return "invisibleCounter";
        }
        else
        {
            return "counter";
        }
    }

    return (
        <div className="gameContainer">
            <div className="buttonsContainer">
                <button onClick={handleClick} className="resetButton">
                    Generate word
                </button>
            </div>
            <p className="gameText">
                {word}
            </p>
            <p className={checkCounter()}>
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




function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export default GameContent;
