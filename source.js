class Board{
    points = []; depthMenu; pointsMenu; menuVisible = false; menuHandler;
    endFlag = false;
    players = [() => this.createX(), () => this.createO()];
    tiles = [];
    tab = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
    toPlay = 0;
    MAX_POINTS = 3;
    DEPTH = 7;
    constructor()
    {
        this.tiles = document.getElementsByClassName('grid-item');
        this.menuHandler = document.getElementById('menu');
        this.menuHandler.style.top = `${this.tiles}`;
        this.depthMenu = document.getElementById('depthMenu');
        this.pointsMenu = document.getElementById('pointsMenu');
        this.pointsMenu.value = this.MAX_POINTS;
        this.depthMenu.value = this.DEPTH;
        this.points.push(document.getElementById('p0'));
        this.points.push(document.getElementById('p1'));
        document.getElementById('headerText').innerText = `First to score ${this.MAX_POINTS} points wins`;
    }
    setDepth()
    {
        this.DEPTH = parseInt(this.depthMenu.value);
    }
    setPointsMax()
    {
        this.MAX_POINTS = parseInt(this.pointsMenu.value);
        document.getElementById('headerText').innerText = `First player to score ${this.MAX_POINTS} points wins`;
    }
    getMenu()
    {
        this.menuVisible = !this.menuVisible;
        if(this.menuVisible)
            this.menuHandler.style.visibility = 'visible' 
            else
            this.menuHandler.style.visibility = 'hidden' 

    }
    init(starting)
    {
        document.getElementById('headerText').innerText = `First to score ${this.MAX_POINTS} points wins`;
        this.endFlag = false;
        this.points[0].innerText = 0;
        this.points[1].innerText = 0;
        this.tab = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        this.toPlay = 0;

        for(let tile of this.tiles)
            tile.innerText = '';

        if(starting == 1)
        {
            let next = this.findBest(0);
            this.move(next, false);
        }
    }

    drawLine(b, e, stroke = 'red', width = 10) {
        let begin = [ (b % 3 + 0.5) * 200, (Math.floor(b / 3) + 0.5 ) * 200];
        let end = [(e % 3 + 0.5) * 200, (Math.floor(e / 3) + 0.5 ) * 200];

        if (stroke) {
            this.context.strokeStyle = stroke;
        }

        if (width) {
            this.context.lineWidth = width;
        }
        
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.context.moveTo(...begin);
        this.context.lineTo(...end);
        this.context.stroke();
        this.canvas.style.display = '';
        setTimeout(() => {
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            this.canvas.style.display = 'none';
        },50);
    }

    move(pos, playNext)
    {   
        if(this.endFlag) {
            this.init(0); return;
        };
        let row = Math.floor(pos / 3);
        let col = pos % 3;
        
        if(this.tab[row][col] != -1) return;

        this.tab[row][col] = this.toPlay;
        this.tiles[pos].appendChild(this.players[this.toPlay]()); 
        this.toPlay += 1;
        this.toPlay %= 2;

        let w, wait = 0;
        if((w = this.winner()) != -1)
        {   
            for(let tile of w.tiles)
                this.tiles[tile].style.backgroundColor = 'red';
            
            window.setTimeout(() => {
                this.clearTile(...w.tiles)
                for(let tile of w.tiles)
                    this.tiles[tile].style.backgroundColor = 'white';
            }, 250)
            wait = 250;
            this.points[w.winner].innerText = `${parseInt(this.points[w.winner].innerText)+w.points}`;
            
            if(this.points[w.winner].innerText >= this.MAX_POINTS) 
            {
                this.endFlag = true;
                document.getElementById('headerText').innerText = `Player ${w.winner+1} wins!`;
            }                
        }

        setTimeout(() => {if(playNext)
        {
            let next = this.findBest(this.toPlay);
            //console.log(next)
            if(next == -1) return;
            this.move(next, false)
        }}, wait);
    }

    createO()
    {
        let o = document.createElement('img');
        o.src = './img/o.png'
        o.style.width = `${this.tiles[0].getBoundingClientRect().width * 0.5}px`
        return o;
    }

    createX()
    {
        let x = document.createElement('img');
        x.src = './img/x.png'
        x.style.width = `${this.tiles[0].getBoundingClientRect().width * 0.5}px`
        return x;
    }

    clearTile(...positions)
    {
        for(let pos of positions)
        {
            let row = Math.floor(pos / 3);
            let col = pos % 3;
            this.tab[row][col] = -1;
            this.tiles[pos].innerHTML = '';
        }
    }

    winner()
    {
        let output = {winner: -1, points: 0, tiles: []}

        if(this.tab[0][0] == 1 && this.tab[1][1] == 1 && this.tab[2][2] == 1) 
        {
            output.winner = 1;
            output.points ++;
            output.tiles.push(0,4,8);
        }
        if(this.tab[0][0] == 0 && this.tab[1][1] == 0 && this.tab[2][2] == 0) 
        {
            output.winner = 0;
            output.points ++;
            output.tiles.push(0,4,8);
        }
            
        if(this.tab[0][2] == 1 && this.tab[1][1] == 1 && this.tab[2][0] == 1) 
        {
            output.winner = 1;
            output.points ++;
            output.tiles.push(2,4,6);
        }
        if(this.tab[0][2] == 0 && this.tab[1][1] == 0 && this.tab[2][0] == 0) 
        {
            output.winner = 0;
            output.points ++;
            output.tiles.push(2,4,6);
        }


        for(let k = 0; k < 3; k++)
        {
            // trojka w wierszu
            if(this.tab[k][0] == 1 && this.tab[k][1] == 1 && this.tab[k][2] == 1) 
            {
                output.winner = 1;
                output.points ++;
                output.tiles.push(3*k,3*k+1,3*k+2);
            }
            if(this.tab[k][0] == 0 && this.tab[k][1] == 0 && this.tab[k][2] == 0) 
            {
                output.winner = 0;
                output.points ++;
                output.tiles.push(3*k,3*k+1,3*k+2);
            }
            // trojka w kolumnie
            if(this.tab[0][k] == 1 && this.tab[1][k] == 1 && this.tab[2][k] == 1) 
            {
                output.winner = 1;
                output.points ++;
                output.tiles.push(k,k+3,k+6);
            }
            
            if(this.tab[0][k] == 0 && this.tab[1][k] == 0 && this.tab[2][k] == 0) 
            {
                output.winner = 0;
                output.points ++;
                output.tiles.push(k,k+3,k+6);
            }
        }

        if(output.winner == -1) return -1;
        else return output;
    }

    findBest( player )
    {
        let bestMove = -1, bestEval = -Infinity;

        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
            {
                if(this.tab[i][j] == -1) // legalny ruch
                {
                    this.tab[i][j] = player;
                    let evaluation = this.eval( false, (player + 1) % 2, 1, {points: [parseInt(this.points[0].innerText), this.points[1].innerText]});
                    this.tab[i][j] = -1;

                    if(evaluation > bestEval)
                    {
                        bestEval = evaluation;
                        bestMove = 3 * i + j;
                    }
                }
            }
        return bestMove;
    }

    anyMovesLeft()
    {
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                if(this.tab[i][j] == -1) return true;
        return false;
    }

    eval(onMove, player, depth, state)
    {
        let win = this.winner()
        if( win != -1 )
        {
            state.points[win.winner] += win.points;
            if(state.points[win.winner] >= this.MAX_POINTS)
            {
                if(onMove) return -100 + depth;
                else return 100 - depth;
            }
            for(let tile of win.tiles)
            {
                let row = Math.floor(tile/3);
                let col = tile % 3;
                this.tab[row][col] = -1;
            }
        }

        if(depth >= this.DEPTH)
        {
            if(win != -1)
            {
                state.points[win.winner] -= win.points;
                for(let tile of win.tiles)
                {
                    let row = Math.floor(tile/3);
                    let col = tile % 3;
                    this.tab[row][col] = win.winner;
                }
            }
            if(onMove)
                return state.points[player] - state.points[(player+1)%2];
            else
                return state.points[(player+1)%2] - state.points[player];
        }

        if(!this.anyMovesLeft()) 
        {
            if(onMove)
                return state.points[player] - state.points[(player+1)%2];
            else
                return state.points[(player+1)%2] - state.points[player];
        }

        let val;

        if(onMove)
        {
            val = -Infinity;
            for(let i=0; i<3; i++)
                for(let j=0; j<3; j++)
                {
                    if(this.tab[i][j] == -1)
                    {
                        this.tab[i][j] = player;
                        let newVal = this.eval(false, (player+1)%2, depth + 1, state);
                        this.tab[i][j] = -1;
                        val = Math.max(newVal, val);
                    }
                }                
        }
        else
        {
            val = +Infinity;
            for(let i=0; i<3; i++)
                for(let j=0; j<3; j++)
                {
                    if(this.tab[i][j] == -1)
                    {
                        this.tab[i][j] = player;
                        let newVal = this.eval(true, (player+1) % 2, depth + 1, state);
                        this.tab[i][j] = -1;
                        val = Math.min(newVal, val);
                    }
                }            
        }

        if( win != -1 )
        {
            state.points[win.winner] -= win.points;
            for(let tile of win.tiles)
            {
                let row = Math.floor(tile/3);
                let col = tile % 3;
                this.tab[row][col] = win.winner;
            }
        }
        return val;
    }
}

let board = new Board();