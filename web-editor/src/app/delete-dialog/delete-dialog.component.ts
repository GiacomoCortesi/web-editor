import { Component, Inject } from '@angular/core';
import { DataService } from  '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  constructor(private dataService: DataService, public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(): void {
    this.dialogRef.close();
    console.log("Deleting file " + this.data.filename)
    this.deleteFile(this.data.file)
    location.reload()
  }
  
  deleteFile(f) {
    this.dataService.deleteFile(f).subscribe(
      result => {
      console.log(result);
    });
  }
}
