import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
    let square;
    if (props.highlight) {
        square = (
            <button className="square highlight" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    else {
        square = (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    return square
}

class Board extends React.Component {
    renderSquare(i) {
        let highlight = false;
        for (const k of wonSquares) {
            if (k === i) highlight = true;
        }
        return (
            <Square
                key={i}
                highlight={highlight}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRows(n) {
        let rows = [];
        for (let i = 0; i < n * n; i = i + n) {
            let squares = [];
            for (let j = i; j < i + n; j++) {
                squares.push(this.renderSquare(j));
            }
            rows.push(<div className="board-row" key={i}>{squares}</div>)
        }
        return rows;
    }

    render() {
        return (
            <div>
                {this.renderRows(3)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            order: false,
        };
    }

    handleClick(i) {
        const location = [
            '(1, 1)',
            '(2, 1)',
            '(3, 1)',
            '(1, 2)',
            '(2, 2)',
            '(3, 2)',
            '(1, 3)',
            '(2, 3)',
            '(3, 3)',
        ];
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    location: location[i],
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    sortMoves() {
        this.setState({
            order: !this.state.order,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let draw = '';
        let moves;
        if (!this.state.order) {
            moves = history.map((step, move) => {
                let bold = '';
                const desc = move ?
                    'Go to move #' + move + ' ' + history[move].location :
                    'Go to game start';
                if (current.location === history[move].location) bold = 'bold';
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)} className={bold}>{desc}</button>
                    </li>
                );
            });
        }
        else {
            moves = history.map((step, move) => {
                let bold = '';
                const asc = move ?
                    'Go to move #' + move + ' ' + history[move].location :
                    'Go to game start';
                if (current.location === history[move].location) bold = 'bold';
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)} className={bold}>{asc}</button>
                    </li>
                );
            }).reverse();
        }
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
            wonSquares = [];
            if (!current.squares.includes(null)) draw = 'Result: Draw';
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => {this.sortMoves()}}>Toggle Order</button>
                    <div>&nbsp;</div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <div>{draw}</div>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            wonSquares = [a, b, c];
            return squares[a];
        }
    }
    return null;
}

let wonSquares = [];

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
