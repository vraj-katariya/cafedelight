import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableService, Table } from '../../../services/table.service';

@Component({
    selector: 'app-table-management',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './table-management.component.html',
    styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent implements OnInit {
    tables: Table[] = [];
    tableForm: FormGroup;

    constructor(
        private tableService: TableService,
        private fb: FormBuilder
    ) {
        this.tableForm = this.fb.group({
            tableNumber: ['', Validators.required],
            capacity: ['', [Validators.required, Validators.min(1)]],
            location: ['Indoor', Validators.required]
        });
    }

    ngOnInit() {
        this.loadTables();
    }

    loadTables() {
        this.tableService.getTables().subscribe(res => {
            this.tables = res.data;
        });
    }

    addTable() {
        if (this.tableForm.invalid) return;

        this.tableService.createTable(this.tableForm.value).subscribe({
            next: () => {
                this.loadTables();
                this.tableForm.reset({ location: 'Indoor' });
                alert('Table added successfully!');
            },
            error: (err) => {
                alert(err.error.message || 'Failed to add table. Table number may already exist.');
            }
        });
    }

    deleteTable(id: string) {
        if (confirm('Are you sure you want to delete this table? This might affect existing bookings.')) {
            this.tableService.deleteTable(id).subscribe({
                next: () => {
                    this.loadTables();
                },
                error: (err) => {
                    alert(err.error.message || 'Error deleting table');
                }
            });
        }
    }

    toggleAvailability(table: Table) {
        const updatedTable = { ...table, isAvailable: !table.isAvailable };
        this.tableService.updateTable(table._id!, updatedTable).subscribe(() => {
            this.loadTables();
        });
    }
}
