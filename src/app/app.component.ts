import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  addForm: FormGroup;
  @ViewChild('myModal') model: ElementRef | undefined;
  @ViewChild('optionModel') model1: ElementRef | undefined;
  employeeObj: Employee = new Employee();
  employeeList: Employee[] = [];
  mockData = [
    { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'web', rating: '2', email: 'g@gmail.com' },
    { id: 2, name: 'Jane Smith', position: 'Project Manager', department: 'web', rating: '2', email: 'g@gmail.com' },
    { id: 3, name: 'Alice Johnson', position: 'Designer', department: 'web', rating: '2', email: 'g@gmail.com' }
  ];
  filteredEmployeeList: Employee[] = [];
  searchTerm: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.email]],
      department: [''],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  saveDataToLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('employees', JSON.stringify(this.employeeList));
    }
  }

  ngOnInit(): void {
    this.loadData();
    if (typeof localStorage !== 'undefined') {
      const localData = localStorage.getItem("employees");
      if (localData != null) {
        this.employeeList = JSON.parse(localData);
        this.filteredEmployeeList = this.employeeList;
      }
    }
  }

  filterEmployees(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredEmployeeList = this.employeeList.filter(employee =>
      employee.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      employee.department.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  openModel() {
    const model = document.getElementById("myModal");
    if (model != null) {
      model.style.display = 'block';
    }
  }

  closeModel() {
    this.employeeObj = new Employee();
    this.addForm.reset();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }

  openOptionModel() {
    const model1 = document.getElementById("optionModel");
    if (model1 != null) {
      model1.style.display = 'block';
    }
  }

  closeOptionModel() {
    this.employeeObj = new Employee();
    if (this.model1 != null) {
      this.model1.nativeElement.style.display = 'none';
    }
  }

  onDelete(item: Employee) {
    const isDelete = confirm("Are you sure want to Delete");
    if (isDelete) {
      const currentRecord = this.employeeList.findIndex(m => m.id === item.id);
      this.employeeList.splice(currentRecord, 1);
      this.saveDataToLocalStorage();
      this.filterEmployees();
    }
  }

  onEdit(item: Employee) {
    this.employeeObj = item;
    this.addForm.patchValue({
      name: item.name,
      position: item.position,
      email: item.email,
      department: item.department,
      rating: item.rating
    });
    this.openModel();
  }

  showMore(item: Employee) {
    this.employeeObj = item;
    this.openOptionModel();
  }

  updateEmployee() {
    const currentRecord = this.employeeList.find(m => m.id === this.employeeObj.id);
    if (currentRecord != undefined && this.addForm.valid) {
      currentRecord.name = this.addForm.get('name')?.value;
      currentRecord.position = this.addForm.get('position')?.value;
      currentRecord.email = this.addForm.get('email')?.value;
      currentRecord.department = this.addForm.get('department')?.value;
      currentRecord.rating = this.addForm.get('rating')?.value;
      this.saveDataToLocalStorage();
      this.filterEmployees();
      this.closeModel();
    } else {
      this.addForm.markAllAsTouched();
    }
  }

  loadData(): void {
    if (typeof localStorage !== 'undefined') {
      const savedData = localStorage.getItem('employees');
      if (savedData) {
        this.employeeList = JSON.parse(savedData);
      } else {
        this.employeeList = this.mockData;
        this.saveDataToLocalStorage();
      }
    } else {
      this.employeeList = this.mockData;
    }
  }

  saveEmployee() {
    if (this.addForm.valid) {
      const employeeData = this.addForm.value;
      this.employeeObj = { ...employeeData, id: this.employeeList.length + 1 };
      if (typeof localStorage !== 'undefined') {
        const isLocalPresent = localStorage.getItem("employees");
        if (isLocalPresent) {
          const oldArray = JSON.parse(isLocalPresent);
          oldArray.push(this.employeeObj);
          this.employeeList = oldArray;
        } else {
          this.employeeList = [this.employeeObj];
        }
        this.filteredEmployeeList = [...this.employeeList];
        this.saveDataToLocalStorage();
      }
      this.addForm.reset();
      this.closeModel();
    } else {
       
    }
  }

  resetData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('employees');
    }
    this.employeeList = this.mockData;
    this.saveDataToLocalStorage();
    this.filteredEmployeeList = [...this.employeeList];
    if (this.model) {
      this.closeModel();
    }
    this.searchTerm = '';
  }
}

export class Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  rating: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.email = '';
    this.position = '';
    this.department = '';
    this.rating = '';
  }
}
