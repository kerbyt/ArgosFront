import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidTypesTasks } from '../../enums/valid-types-tasks.enum';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Department } from '../../interfaces/department.interface';
import { ProviderService } from '../../services/provider.service';
import { Util } from '../../util/util';
import { CommonService } from '../../interfaces/common-services.interface';
import { MsgBoxService } from '../../components/msg-box/msg-box.service';
import { IfStmt } from '@angular/compiler';
import { CommonServiceTask } from '../../interfaces/commonServiceTask.interface';
import { CommonServiceSubTask } from '../../interfaces/commonServiceSubTask.interface';

@Component({
  selector: 'app-project-common',
  templateUrl: './project-common.component.html',
  styles: []
})
export class ProjectCommonComponent implements OnInit {
  idProject: string;
  form: FormGroup = new FormGroup({});  
  existRecords: boolean= false;

  enumType =  Object.keys(ValidTypesTasks).map(
    r => {
        return ValidTypesTasks[r];       
    }
  ); 


  constructor(private activatedRoute: ActivatedRoute,
              private _ps: ProviderService,
              private router: Router,
              private _msg: MsgBoxService) {
       
    this.enumType.splice(0,1);
    
    this.enumType.forEach(element => {
       this.form.setControl(element, new FormControl('', [Validators.required,Validators.min(1) ]) );       
    });
    

    this.activatedRoute.params.subscribe(
      p => {
        if(p['id']){
          this.idProject = p['id'];
        }
      }
    );

    let sub = 0;
    let emp = 0;
    let piso = 0;

    this._ps.getObjectsByFather(Util.URL_COMMON_SERVICES,'project',0,this.idProject,0).subscribe(
      res => {
        this._ps.refresToken(res);
        console.log(res);
        
        this.existRecords = res.totalRecords > 0 ? true: false;
        
        sub = this.countOcurrences(res.commonServices, ValidTypesTasks.SUBTERRANEOS);         
        emp = this.countOcurrences(res.commonServices, ValidTypesTasks.EMPLAZAMIENTOS);         
        piso = this.countOcurrences(res.commonServices, ValidTypesTasks.PISOS); 
        this.form.get(ValidTypesTasks.SUBTERRANEOS).setValue(sub);   
        this.form.get(ValidTypesTasks.EMPLAZAMIENTOS).setValue(emp);
        this.form.controls[ValidTypesTasks.PISOS].setValue(piso);   
        
      }        
    )
    
    
    // this.form = new FormGroup();
    

  }

  ngOnInit() {
    
  }


  countOcurrences(c: CommonService[], task: string): number 
  {
    let counter:number  = 0;
    c.forEach(
      r=>{
        if(r.type == task){
          console.log('en el if ', task);
          
          counter = counter+1;
        }
      }  

    );
    
    return counter;
  }


  save() {
    if(!this.existRecords){ 
     
       Object.keys(this.form.value).forEach(
          async res => {
            console.log(res);
            
            for(let i=0; i <  this.form.controls[res].value; i++){
              let d: any = {
                project: this.idProject,
                number: i+1,
                type: res,
                status: 0    
              }
              await this._ps.saveObject(Util.URL_COMMON_SERVICES,d,0).subscribe(
                async resp => { 
                  this._ps.refresToken(resp);
                  if( resp.success == true ) {
                    //se guardan automaticamente las tareas
                    let url = `${ Util.URL_TASKS_BY_TYPE }/${ res }`
                     await this._ps.getObjectsAny(url,0).subscribe(
                     async respTask => {
                        this._ps.refresToken(respTask);
                        if( respTask.success == true ) {
                        await respTask.tasks.forEach(
                            async task => {

                            let commonTask: CommonServiceTask = {
                              commonService: resp.commonService._id,
                              task: task._id,
                              type: res,
                              project: resp.commonService.project,
                              status: 0
                            }

                            await this._ps.saveObject(Util.URL_COMMON_SERVICES_TASKS, commonTask,0).subscribe(
                               async respSaveTasks => {
                                this._ps.refresToken(respSaveTasks);
                                if( respSaveTasks.success == true ) {
                                  //se guardan automaticamente las sub tareas
                                  await this._ps.getObjectsByFather(Util.URL_SUB_TASKS,"task",0, task._id,0).subscribe(
                                   async respSubTasks => {
                                      this._ps.refresToken(respSubTasks);
                                      if( respSubTasks.success == true ) {
                                       await respSubTasks.subTasks.forEach(
                                          async subtask => {
                                          
                                          let commonSubTask: CommonServiceSubTask = {
                                            commonService: resp.commonService._id,
                                            subTask: subtask._id,
                                            task: task._id,
                                            type: res,
                                            project: resp.commonService.project,
                                            status: 0
                                          }

                                          await this._ps.saveObject(Util.URL_COMMON_SERVICES_SUB_TASKS, commonSubTask,0).subscribe(
                                            respSaveTasks => {
                                              this._ps.refresToken(respSaveTasks);
                                              if( respSaveTasks.success == true ) {
                                              }
                                            });
                                        });
                                      }
                                    });
                                }
                              });

                          });
                        }
                      }
                    );
                  }
  
                }
              )  
            }
          }
       );
            
       console.log('al final ');
        
       this._msg.show(Util.SAVE_TITLE, Util.MSJ_SAVE_SUCCESS,Util.ACTION_SUCCESS).subscribe(
         res => {
            this.router.navigate(['/pages/projectEmployees',this.idProject]);   
         }
       )
    }else {
      this.router.navigate(['/pages/projectEmployees',this.idProject]);
    }   
     
     
  }


}// end Class



