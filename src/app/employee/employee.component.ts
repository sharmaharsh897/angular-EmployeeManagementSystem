import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from 'src/models/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
@Input() employee: Employee;
@Output() onRemove= new EventEmitter<number>();
@Output() onEdit=new EventEmitter<number>();



constructor() { 
  this.employee={
    fullname:'',
    location:'',
    email:'',
    mobile:0
    }
}

ngOnInit(): void {
    console.log(this.employee)
}

deleteEmployeeClicked(){
  this.onRemove.emit(this.employee.id);
}

editEmployeeCLicked(){
  this.onEdit.emit(this.employee.id); 
}

}
