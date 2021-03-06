import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SubTask } from '../../interfaces/subTask.interface';
import { ProviderService } from '../../services/provider.service';
import { Util } from '../../util/util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-subtask',
  templateUrl: './form-subtask.component.html',
  styles: []
})
export class FormSubtaskComponent implements OnInit, AfterViewInit {
  
  form: FormGroup;
  subTask: SubTask;

  @Input() idSubTask: string;
  @Input() title: string ="";

  constructor(private _ps: ProviderService,
              private router: Router,) { 

    let user = JSON.parse(localStorage.getItem('user'));
    this._ps.getObject(Util.URL_USER,user._id).subscribe(
        res => { 
            this._ps.refresToken(res);                                           
            let userTemp = res.users[0];
            if(user.role != userTemp.role){
                localStorage.setItem('user','');
                this.router.navigate(['login'])
            }
        }
    )
       
  }

  ngOnInit() {
    this.form =  new FormGroup({
      'name': new FormControl('',Validators.required),
      'task': new FormControl('',Validators.required),
      'position': new FormControl('',[Validators.required, Validators.max(1000), Validators.min(1)])

    })


  }


  getSubTask(): SubTask {
      if(this.idSubTask){
        this.subTask._id = this.idSubTask 
      }
      
      this.subTask = this.form.value;      
      return this.subTask;

  }


  ngAfterViewInit() {
    
      if(this.idSubTask){
        this._ps.getObject(Util.URL_SUB_TASKS, this.idSubTask,0).subscribe(
            res => {
                this._ps.refresToken(res);  
                this.subTask = res.subTasks[0];
                this.form.setValue(
                    {
                      'name': this.subTask.name,
                      'task': this.subTask.task._id,
                      'position': this.subTask.position
                    }

                )
     

            }
          
        )
      }

  }

}
