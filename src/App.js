import {useState} from "react";

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const renderButton =(description,move) =>{
        return(
            <button
                className="button"
                onClick={() => jumpTo(move)}>{description}</button>
        )
    }
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (<ul key={move}>
            {renderButton(description,move)}
        </ul>);
    });
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        console.log(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    return (<div className="game">
        <div className="game-info">
            <ol>{moves}</ol>
        </div>
        <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}
                   moves={moves}/>
        </div>
        <div className="move-index">
            Moves remaining: {9 - currentMove}
        </div>
    </div>);
}

function Board({xIsNext, squares, onPlay, moves}) {
    const winnerLine = calculateWinner(squares)

    const renderBoard = () => {
        const board = [];
        for (let i = 0; i < 3; i++) {
            const squareRow = [];
            for (let j = 0; j < 3; j++) {
                const squareIndex = i * 3 + j;
                squareRow.push(renderSquare(squareIndex));
            }
            board.push(<div key={i} className="board-row">
                {squareRow}
            </div>);
        }
        return board;
    }

    const renderSquare = (i) => {
        const isWinnerSquare = winnerLine && winnerLine.includes(i);

        return (<Square
                key={i}
                value={squares[i]}
                isWinnerSquare={isWinnerSquare}
                winnerLine={winnerLine}
                onSquareClick={() => handleClick(i)}

            />);
    };
    let status;
    if (winnerLine && moves.length <= 10) {
        const winner = squares[winnerLine[1]];
        status = "Winner: " + winner;
    } else if (moves.length <= 9) {
        status = "Next player: " + (xIsNext ? "X" : "O");
    } else if (!winnerLine && moves.length <= 10) status = "Draw!";

    return (<>
        {renderBoard()}
        <div className="status">{status}</div>
    </>);

    function calculateWinner(squares) {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
                return lines[i];
            }
        }
        return null;
    }

    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }
}

function Square({value, onSquareClick, isWinnerSquare, winnerLine}) {

    let className = 'square';
    if (winnerLine) {
        className = `square${isWinnerSquare ? 'winnerSquare' : 'loserSquare'}`
    }
    return (<button
        className={className}
        onClick={onSquareClick}>
        {value}
    </button>)
}


