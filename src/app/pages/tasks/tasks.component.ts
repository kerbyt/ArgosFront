import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { ProviderService } from '../../services/provider.service';
import { Util } from '../../util/util';
import { Router } from '@angular/router';
import { MsgBoxService } from '../../components/msg-box/msg-box.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styles: []
})
export class TasksComponent implements OnInit {

  title = "Faenas";  
  collection: Task[] = []
  idTasks: string;
  idxSel: number;
  term: string;
  model: string;
  totalRecords: number;
  userTemp: any;

  constructor(private _ps:ProviderService,
                      private router: Router,
                      private _msg: MsgBoxService) { 

    let user = JSON.parse(localStorage.getItem('user'));
    this._ps.getObject(Util.URL_USER,user._id).subscribe(
        res => { 
            this._ps.refresToken(res);                                           
            this.userTemp = res.users[0];
            if(user.role != this.userTemp.role){
                localStorage.setItem('user','');
                this.router.navigate(['login'])
            }
        }
    )

    this.model = Util.URL_TASKS;                      

    this._ps.getObjects(Util.URL_TASKS).subscribe(
        res => {
            this._ps.refresToken(res);
            this.collection = res.tasks;
            this.totalRecords = res.totalRecords;  
        }

    );

    
  }

  ngOnInit() {
  }


  edit(id: string) {
    
    this.router.navigate(['/pages/editTask',id])

  }


  delete(idx:number ){
      this.idTasks = this.collection[idx]._id;
      this.idxSel = idx;
      this._msg.show(Util.DELETE_TITLE ,Util.MSJ_DELETE_QUESTION, Util.ACTION_DELETE).subscribe(
        res => {
            if(res.type === Util.ACTION_DELETE && res.response === Util.OK_RESPONSE ){
                              
                this._ps.deleteObject(Util.URL_TASKS,this.idTasks).subscribe(
                    res => {                                   
                        this._ps.refresToken(res);
                        if(res.success == true) {
                            this._msg.show("", Util.MSJ_DELETE_SUCCESS, Util.ACTION_SUCCESS);                                            
                            this.collection.splice(this.idxSel,1);
                                                        
                        }
                    }
                ) 
            }
        }

      );

  }


  search() {
     if(this.term.length>0){
        this._ps.getObjects(Util.URL_TASKS, 0 ,this.term ).subscribe(
            res => {              
                this._ps.refresToken(res);
                this.collection = res.tasks;
                this.totalRecords = res.totalRecords; 
            }   
        )       
    }else{
        this._ps.getObjects(Util.URL_TASKS).subscribe(
            res => {
                this._ps.refresToken(res);
                this.collection = res.tasks;
               this.totalRecords = res.totalRecords; 
            }
        );
    } 
  }
  



}


