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
  knockoutphases: [];
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
}

@Component({
  selector: 'app-bhoys',
  templateUrl: './bhoys.component.html',
  styleUrls: ['./bhoys.component.css']
})
export class BhoysComponent implements OnInit {
  
  form: FormGroup;

  fixtures = [] as any;  
  results = [] as any;
  all_fixtures = [] as any;  
  all_results = [] as any;
  playerNames = [] as any;
  headers = ["Player","Played","Wins","Losses","Draws","Scored","Conceded","Difference","Points"]
  teamDict: Dictionary<string> = {};
  teamNamesDict: Dictionary<string> = {};
  players = [
    { name: "Niall Hughes", teams: ["Portugal","Netherlands","Sweden","Finland"]},
{ name: "David O'Hara", teams: ["England","Switzerland","Sweden","Finland"]},
{ name: "Eoghan Flynn", teams: ["Belgium","Wales","Slovakia","Hungary"]},
{ name: "Matty McGeogh", teams: ["Spain","Germany","Turkey","Scotland"]},
{ name: "Jono Andrews", teams: ["France","Denmark","Poland","Czech Republic"]},
{ name: "Justin Ferris", teams: ["Italy","Croatia","Austria","Russia"]},
{ name: "Mark Harley", teams: ["Spain","Croatia","Ukraine","Russia"]},
{ name: "Peter Rooney", teams: ["England","Denmark","Ukraine","Hungary"]},
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
        this.teamDict[this.players[i].teams[j]] =  this.players[i].name;  
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
    })
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
    for(let i=0; i<data.groups.length; i++){
      for(let j=0; j<data.groups[i].matches.length; j++){
        var match = data.groups[i].matches[j];
        match.home_team_ui = this.teamNamesDict[match.home_team]
        match.away_team_ui = this.teamNamesDict[match.away_team]
        match.home_player = this.teamDict[match.home_team_ui]
        match.away_player = this.teamDict[match.away_team_ui]
        if(match.finished)
          results.push(match);
        else
          fixtures.push(match);
      }
    }
    this.fixtures = fixtures.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    this.all_fixtures = this.fixtures
    this.results = results.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    this.all_results = this.results
  }

  createEmptyStandings()
  {
    let dict: Dictionary<Standing> = {};
    
    for(let i=0; i<this.players.length; i++){
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
      }
    }

    for(let i=0; i<this.results.length; i++){
      var result = this.results[i];  
      dict[result.home_player].Played++;
      dict[result.away_player].Played++;
      dict[result.home_player].Scored += result.home_result;
      dict[result.away_player].Scored += result.away_result;
      dict[result.home_player].Conceded += result.away_result;
      dict[result.away_player].Conceded += result.home_result;
      if(result.home_result == result.away_result)
      {
        dict[result.home_player].Points += 1;
        dict[result.away_player].Points += 1;
        dict[result.home_player].Draws += 1;
        dict[result.away_player].Draws += 1;
      }
      else if(result.home_result > result.away_result)
      {
        dict[result.home_player].Points += 3;
        dict[result.home_player].Wins += 1;
        dict[result.away_player].Losses += 1;
      }
      else if(result.home_result < result.away_result)
      {
        dict[result.away_player].Points += 3;
        dict[result.home_player].Losses += 1;
        dict[result.away_player].Wins += 1;
      }
    }
    var keys = Object.keys(dict);
    let standings = []
    for (let i = 0; i<keys.length; i++)
    {
      standings.push(dict[keys[i]])
    }
    this.rows = standings.sort((a, b) => b.Points - a.Points);
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
    for(let i=0; i<this.all_fixtures.length; i++){
      if(this.all_fixtures[i].home_player == player 
        || this.all_fixtures[i].away_player == player)
        fixtures.push(this.all_fixtures[i])
    }
    for(let i=0; i<this.all_results.length; i++){
      if(this.all_results[i].home_player == player 
        || this.all_results[i].away_player == player)
        results.push(this.all_results[i])
    }
    this.fixtures = fixtures
    this.results = results
  }
    
}
