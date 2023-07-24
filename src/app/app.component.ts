import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/models/employee.model';
import { EmployeeService } from './services/employee.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Employee Management System';
  @ViewChild('addEmployeeButton') addEmployeeButton: any;

  employeeForm: FormGroup;

  employees:Employee[];
  employeesToDisplay:Employee[];

  
  locationOptions=[
    'Bangalore',
    'Chennai',
    'Pune',
    'Hyderabad'
  ];

  constructor(private fb:FormBuilder, private employeeService: EmployeeService){
    this.employeeForm=fb.group({});
    this.employees=[];
    this.employeesToDisplay=this.employees;

  }

  ngOnInit(): void {
    // this.employeeForm=this.fb.group({
    //   fullname:this.fb.control('',Validators.required),
    //   location:this.fb.control('default'),
    //   email: this.fb.control(''),
    //   mobile: this.fb.control(null)
    // });
    this.employeeForm=this.fb.group({
         fullname: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
         email: ["",[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
         mobile: ["",[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
         location: ["",[Validators.required]]
     });


    this.employeeService.getEmployees().subscribe((res) => {
      for (let emp of res){
        this.employees.unshift(emp);
      } 
      this.employeesToDisplay=this.employees;
      console.log(res);
    });
      
  }

  addEmployee(){
    let employee: Employee={
      fullname : this.FullName.value,
      location: this.locationOptions[parseInt(this.Location.value)],
      email: this.Email.value,
      mobile: this.Mobile.value
      
    };
    this.employeeService.postEmployee(employee).subscribe((res)=>{
      this.employees.push(res);
      this.clearForm();
      
    })
    console.log(this.employeeForm.value);
  }

  deleteEmployee(event: any){
    this.employees.forEach((val,index)=>{
      if(val.id==parseInt(event)){
        this.employeeService.deleteEmployee(event).subscribe((res)=>{
          this.employees.splice(index,1);
        })
      }
    })
  }

  editEmployee(event: any){
    this.employees.forEach((val,ind)=>{
      if(val.id==event){
        this.setForm(val);
      }
    });
    this.deleteEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }

  searchEmployee(event: any){
    let filteredEmployee: Employee[] =[];

    if(event==''){
      this.employeesToDisplay= this.employees;
    }else{
      filteredEmployee =this.employees.filter((val,index)=>{
        let targetKey= val.fullname.toLowerCase();
        let searchKey=event.toLowerCase();
        return targetKey.includes(searchKey);
      })
      this.employeesToDisplay=filteredEmployee;
    }
  }

  setForm(emp: Employee){
    this.FullName.setValue(emp.fullname);
    this.Email.setValue(emp.email);
    this.Mobile.setValue(emp.mobile);

    let locationIndex=0;
    this.locationOptions.forEach((val,index)=>{
      if(val==emp.location) locationIndex=index;
    });
    this.Location.setValue(locationIndex);
  }

  clearForm(){
    this.FullName.setValue('');
    this.Location.setValue('');
    this.Email.setValue('');
    this.Mobile.setValue(null);
  }

  public get FullName(): FormControl{
    return this.employeeForm.get('fullname') as FormControl;
  }
  public get Location(): FormControl{
    return this.employeeForm.get('location') as FormControl;
  }
  public get Email(): FormControl{
    return this.employeeForm.get('email') as FormControl;
  }
  public get Mobile(): FormControl{
    return this.employeeForm.get('mobile') as FormControl;
  }
}
