import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

export interface Player {
  name: string;
  teams: [];
}

export interface Response {
  stadiums: Stadium[];
  tvchannels: [];
  teams: Team[];
  groups: Group[];
  knockoutphases: KnockoutRound[];
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
}

export interface Group {
  id: string;
  name: string;
  matches: Match[];
}

export interface Match {
  id: string;
  name: string;
  home_team: string;
  away_team: string;
  home_team_ui: string;
  away_team_ui: string;
  home_result: string;
  away_result: string;
  date: string;
  finished: boolean;
  home_player: string;
  away_player: string;
}

export interface KnockoutRound {
  matches: Match[];
}

interface Dictionary<T> {
  [Key: string]: T;
}

export interface Team {
  id: string;
  name: string;
  rank: string;
}

export interface Standing {
  Player: string;
  Played: number;
  Wins: number;
  Losses: number;
  Draws: number;
  Scored: number;
  Conceded: number;
  Difference: number;
  Points: number;
  RemainingTeams: number;
}

@Component({
  selector: 'app-mow',
  templateUrl: './mow.component.html',
  styleUrls: ['./mow.component.css']
})
export class MowComponent implements OnInit {
  
  form: FormGroup;

  fixtures = [] as any;  
  results = [] as any;
  all_fixtures = [] as any;  
  all_results = [] as any;
  playerNames = [] as any;
  headers = ["Player","Played","Wins","Losses","Draws","Scored","Conceded","Difference","Remaining Teams","Points"]
  teamDict: Dictionary<string[]> = {};
  teamNamesDict: Dictionary<string> = {};
  players = [
    { name: "Niall Hughes", teams: ["Spain","Germany","Ukraine","Czech Republic"]},
{ name: "David O'Hara", teams: ["Portugal","Switzerland","Sweden","Russia"]},
{ name: "William Moore", teams: ["Belgium","Netherlands","Poland","Hungary"]},
{ name: "Robert Lynch", teams: ["England","Denmark","Turkey","North Macedonia"]},
{ name: "David Casey", teams: ["Italy","Croatia","Slovakia","Finland"]},
{ name: "John Fleming", teams: ["France","Wales","Austria","Scotland"]},
{ name: "Sean Hussey", teams: ["England","Netherlands","Turkey","Hungary"]},
{ name: "Fintan McCloskey", teams: ["Italy","Germany","Sweden","Scotland"]},
{ name: "Fiachra Cassin", teams: ["France","Croatia","Ukraine","Finland"]},
{ name: "Fran Sheridan", teams: ["Portugal","Denmark","Poland","Czech Republic"]},
{ name: "Donal Sheridan", teams: ["Spain","Wales","Austria","Russia"]},
{ name: "Shane Moore", teams: ["Belgium","Switzerland","Slovakia","North Macedonia"]},
{ name: "Rob Fay", teams: ["France","Croatia","Slovakia","North Macedonia"]},
{ name: "Conor Devlin", teams: ["Portugal","Switzerland","Ukraine","Scotland"]},
{ name: "Conor Moore", teams: ["Spain","Denmark","Turkey","Hungary"]},
{ name: "Joey McKenna", teams: ["Italy","Netherlands","Sweden","Russia"]},
{ name: "Mark Hughes", teams: ["England","Germany","Austria","Finland"]},
{ name: "Eoin Moore", teams: ["Belgium","Wales","Poland","Czech Republic"]},
  ]
       
   rows = [] as Standing[];
   
   
   
 
 

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.form = this.formBuilder.group({
      playerNames: ['']
    });

    this.playerNames = this.getPlayerData();
    
   }

  ngOnInit(): void {
      this.getData();
  }

  getPlayerData()
  {
    for(let i=0; i<this.players.length; i++){
      for(let j=0; j<this.players[i].teams.length; j++){      
        if(this.players[i].teams[j] in this.teamDict)  
        {
          this.teamDict[this.players[i].teams[j]].push(this.players[i].name);
        }
        else
        { 
          this.teamDict[this.players[i].teams[j]] =  [this.players[i].name]
        } 
      }
    }
  }


  getRawData() {
    return this.http.get<Response>("https://raw.githubusercontent.com/lsv/uefa-euro-2020/master/data.json");
  }

  getData(){
    this.getRawData()
    .subscribe((data: Response) =>
    {
      this.createTeams(data.teams);
      this.createMatches(data);
      this.createEmptyStandings();
      this.eliminateTeams();
    })
  }

  eliminateTeams()
  {
    for(let i=0; i<this.players.length; i++){
      for(let j=0; j < this.players[i].teams.length; j++){
        let eliminated = true;
        for(let k=0; k < this.all_fixtures.length && eliminated; k++){
          console.log(this.all_fixtures[k])
          if(this.all_fixtures[k].home_team_ui == this.players[i].teams[j]
            || this.all_fixtures[k].away_team_ui == this.players[i].teams[j])
            eliminated = false;
        }
        if(eliminated)
          this.players[i].teams[j] = this.players[i].teams[j] + " (ELIMINATED)";
        else{
          for(let l=0; l < this.rows.length; l++)
          {
            if(this.rows[l].Player == this.players[i].name)
              this.rows[l].RemainingTeams++;
          }
        }
      }
    }
  }

  createTeams(teams: Team[])
  {
      for(let i=0; i<teams.length; i++){
      {
        this.teamNamesDict[teams[i].id] = teams[i].name;
      }
    }
  }

  createMatches(data: Response)
  {
    let fixtures = [] as Match[]
    let results = []
    console.log(this.teamNamesDict)
    console.log(this.teamDict)
    for(let i=0; i<data.groups.length; i++){
      for(let j=0; j<data.groups[i].matches.length; j++){
        var match = data.groups[i].matches[j];
        
        console.log(match)
        match.home_team_ui = this.teamNamesDict[match.home_team]
        match.away_team_ui = this.teamNamesDict[match.away_team]
        match.home_player = this.teamDict[match.home_team_ui].join(", ",)
        match.away_player = this.teamDict[match.away_team_ui].join(", ",)
        if(match.finished)
          results.push(match);
        else
          fixtures.push(match);
      }
    }
    
    for(let key in data.knockoutphases){
      for(let j=0; j<data.knockoutphases[key].matches.length; j++){
        var match = data.knockoutphases[key].matches[j];
        if(match.home_team == null) continue;
        console.log(match)
        match.home_team_ui = this.teamNamesDict[match.home_team]
        match.away_team_ui = this.teamNamesDict[match.away_team]        
        match.home_player = this.teamDict[match.home_team_ui].join(", ",)
        match.away_player = this.teamDict[match.away_team_ui].join(", ",)
        if(match.finished)
          results.push(match);
        else
          fixtures.push(match);
      }
    }

    console.log(this.fixtures)
    this.fixtures = fixtures.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    this.all_fixtures = this.fixtures
    this.results = results.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    this.all_results = this.results
  }

  createEmptyStandings()
  {
    let dict: Dictionary<Standing> = {};
    
    for(let i=0; i<this.players.length; i++){
      console.log(this.players[i].name)
      dict[this.players[i].name] = 
      {
        Player: this.players[i].name,
        Played: 0,
        Wins: 0,
        Losses: 0,
        Draws: 0,
        Scored: 0,
        Conceded: 0,
        Difference: 0,
        Points: 0,
        RemainingTeams: 0,
      }
    }

    for(let i=0; i<this.results.length; i++){
      var result = this.results[i];  
      let home_players = result.home_player.split(',')
      for(let j = 0; j<home_players.length; j++)
      {
        let home_player = home_players[j].trim();
        dict[home_player].Played++;
        dict[home_player].Scored += result.home_result;
        dict[home_player].Conceded += result.away_result;
        if(result.home_result == result.away_result)
        {
          dict[home_player].Points += 1;
          dict[home_player].Draws += 1;
        }
        else if(result.home_result > result.away_result)
        {
          dict[home_player].Points += 3;
          dict[home_player].Wins += 1;
        }
        else if(result.home_result < result.away_result)
        {
          dict[home_player].Losses += 1;
        }
      }
      let away_players = result.away_player.split(',')
      for(let j = 0; j<away_players.length; j++)
      {
        let away_player = away_players[j].trim();
        dict[away_player].Played++;
        dict[away_player].Scored += result.away_result;
        dict[away_player].Conceded += result.home_result;

        if(result.home_result == result.away_result)
        {
          dict[away_player].Points += 1;
          dict[away_player].Draws += 1;
        }
        else if(result.home_result > result.away_result)
        {
          dict[away_player].Losses += 1;
        }
        else if(result.home_result < result.away_result)
        {
          dict[away_player].Points += 3;
          dict[away_player].Wins += 1;
        }
      }
      
    }
    var keys = Object.keys(dict);
    let standings = []
    for (let i = 0; i<keys.length; i++)
    {
      dict[keys[i]].Difference = dict[keys[i]].Scored - dict[keys[i]].Conceded;
      standings.push(dict[keys[i]])
    }
    this.rows = standings.sort((a, b) => b.Points - a.Points || b.Difference - a.Difference);
  
  }  

  onChange(value:string){
    
    console.log(value)
    if(value == "All Players")
    {
      this.fixtures = this.all_fixtures
      this.results = this.all_results
      return
    }
    console.log(value)
    let fixtures = []
    let results = []
    for(let i=0; i<this.all_fixtures.length; i++){
      if(this.all_fixtures[i].home_player == value 
        || this.all_fixtures[i].away_player == value)
        fixtures.push(this.all_fixtures[i])
    }
    for(let i=0; i<this.all_results.length; i++){
      if(this.all_results[i].home_player == value 
        || this.all_results[i].away_player == value)
        results.push(this.all_results[i])
    }
    this.fixtures = fixtures
    this.results = results
  }

  onChanged(value:any){
    if(value.value == undefined)
    {
      this.fixtures = this.all_fixtures
      this.results = this.all_results
      return
    }
    let player = value.value.name;
    let fixtures = []
    let results = []
    console.log(player)
    for(let i=0; i<this.all_fixtures.length; i++){
      console.log(this.all_fixtures[i])
      if(this.all_fixtures[i].home_player.includes(player) 
        || this.all_fixtures[i].away_player.includes(player))
        fixtures.push(this.all_fixtures[i])
    }
    for(let i=0; i<this.all_results.length; i++){
      if(this.all_results[i].home_player.includes(player) 
        || this.all_results[i].away_player.includes(player))
        results.push(this.all_results[i])
    }
    this.fixtures = fixtures
    this.results = results
  }
    
}
