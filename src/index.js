//React Demo
import { Component } from "react";
import reactDom from "react-dom";
import './index.css';
//Square
function Square(props) {
    return (
        <button className={'square ' + props.winnerStyle} onClick={props.onClick}>{props.value} </button>
    )
}
//Board
class Board extends Component {
    renderSquare(i, winner) {
        console.log(winner);
        const colums = 3;
        const rows = 3;
        const boardRow = [];
        for (let j = 0; j < colums; j++) {
            boardRow.push(<Square key={j + i * rows} value={this.props.squares[j + i * rows]}
                onClick={() => { this.props.onClick(j + i * rows) }}
                winnerStyle={winner && winner.includes(j + i * rows) ? 'winner' : ''}
            />);
        }
        return boardRow;
    }

    render() {
        const boardAll = [];
        const rows = 3;
        const winner = calculateWinner(this.props.squares);
        for (let i = 0; i < rows; i++) {
            boardAll.push(<div className="board-row" key={i}>{this.renderSquare(i, winner)}</div>)
        }
        return (
            <div>
                {boardAll}
            </div>
        )
    }
}
//Games
class Games extends Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinate: ''
            }],
            currentSelect: '',
            stepNumber: 0,
            isReverse: false,
            isxNext: true
        }
    }
    handelClick(i) {
        //react数据中不可变性，防止引用，实现复杂功能，且可追溯
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];//最后一步为数组最后一组值
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        //存储坐标
        const rows = 3, colums = 3;
        let row, colum;
        colum = (i + 1) % colums === 0 ? colums : (i + 1) % colums;
        row = parseInt(i / rows) + 1;
        const coordinate = `(${colum},${row})`;
        //已有值不可在点击
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.isxNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares, coordinate }]),
            stepNumber: history.length,
            isxNext: !this.state.isxNext
        })
    }
    jumpTo(move) {
        this.setState({
            stepNumber: move,
            isxNext: (move % 2) === 0
        });

    }
    reverseClick() {
        this.setState({
            isReverse: !this.state.isReverse
        })
    }
    render() {
        let status;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else if (this.state.stepNumber === 9) {
            status = 'A Draw'
        } else {
            status = 'Next Player: ' + (this.state.isxNext ? 'X' : 'O');
        }
        const moves = history.map((step, move) => {
            return (<li key={move} className={this.state.stepNumber === move ? 'active' : ''}>
                <button style={{ fontWeight: this.state.stepNumber === move ? '600' : '' }} onClick={() => { this.jumpTo(move) }}>{move ? 'Go to move #' + move : 'Go to game start'}</button>
                <span>{(move ? 'coordinate:' + step.coordinate : null)}</span>
            </li>)
        })
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} onClick={(i) => { this.handelClick(i) }} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button style={{ 'marginTop': '10px' }} onClick={this.reverseClick.bind(this)}>{this.state.isReverse ? '降序排列' : '升序排列'}</button>
                    <ol>{this.state.isReverse ? moves.reverse() : moves}</ol>
                </div>
            </div>
        )
    }
}

reactDom.render(<Games />, document.getElementById('root'));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    //判断数组各位置相同值是否连成一线，否则返回null判空
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        //比较方法：两两相等，则全等
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            //return squares[a]
            //返回获胜索引
            return lines[i];
        }
    }
    return null;
}

