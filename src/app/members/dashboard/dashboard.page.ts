import { Component, OnInit } from "@angular/core";
import { LoadingController, ToastController } from "@ionic/angular";
import { ClinicService } from "src/app/services/clinic.service";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { ToastService } from "src/app/shared/toast.service";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {
  clinics: any;
  doctorId: any;
  NewClinics: any = [];
  DelClinics: any = [];
  constructor(
    private loadingController: LoadingController,
    private clinicService: ClinicService,
    private toastService: ToastService,
    private storage: Storage,
    private androidPermissions: AndroidPermissions
  ) {}

  ngOnInit() {
    // this.storage.get(environment.CLINICS).then(clinics => {
    //   this.clinics = clinics;
    // });
    // this.storage.get(environment.DOCTOR_Id).then(docId => {
    //   this.doctorId = docId;
   //   if (!this.clinics) this.getClinics(this.doctorId);
  //  this.getClinics(this.doctorId);
  //  });
  console.log(this.clinicService.clinics);
    this.storage.set(environment.SMS, 0);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => {
        if(!result.hasPermission){
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS);
        }
      }
    );
  }
  // async getClinics(id) {
  //   const loading = await this.loadingController.create({ message: "Loading" });
  //   await loading.present();

  //   await this.clinicService.getClinics(id).subscribe(
  //     res => {
  //       loading.dismiss();
  //       if (res.IsSuccess) {
  //         this.storage.set(environment.CLINICS, this.clinicService.clinics);
  //         for (let i = 0; i < this.clinicService.clinics.length; i++) {
  //           if (this.clinicService.clinics[i].IsOnline == true) {
  //             this.storage.set(environment.CLINIC_Id, this.clinicService.clinics[i].Id);
  //           }
  //         }
  //       } else {
  //         loading.dismiss();
  //         this.toastService.create(res.Message, "danger");
  //       }
  //     },
  //     err => {
  //       loading.dismiss();
  //       this.toastService.create(err, "danger");
  //     }
  //   );
  // }

  async uploadata() {
    // await this.storage.get(environment.CLINICS).then(clinics => {
    //   this.clinics = clinics;
    // });
    // console.log(this.clinics);
    // for new clinics
    this.clinicService.clinics.forEach(item => {
      if (!item.Id && !item.Isdeleted) this.NewClinics.push(item);
      if (item.Id && item.Isdeleted) this.DelClinics.push(item);
    });
    console.log(this.NewClinics);
    console.log(this.DelClinics);
    const loading = await this.loadingController.create({
      message: "Loading"
    });
    await loading.present();
    if (this.NewClinics.length > 0) {
      this.NewClinics.forEach(element => {
        this.addNewClinic(element);
      });
    }
    if (this.DelClinics.length > 0) {
      this.DelClinics.forEach(element => {
        this.deleteClinic(element.Id);
      });
    }
 //   this.getClinics(this.doctorId);
    loading.dismiss();
    this.toastService.create("successfully added");
  }

  async addNewClinic(data) {
    {
      console.log(data);
      this.toastService.create("successfully added");
      await this.clinicService.addClinic(data).subscribe(
        res => {
          if (res.IsSuccess) {
            // this.toastService.create("successfully added");
          } else {
            //  loading.dismiss();
            //  this.toastService.create(res.Message, "danger");
          }
        },
        err => {
          //  loading.dismiss();
          this.toastService.create(err, "danger");
        }
      );
    }
  }

  async deleteClinic(id) {
    // const loading = await this.loadingController.create({
    //   message: "Loading"
    // });
    // await loading.present();
    this.storage.set(environment.CLINICS, this.clinics);
    // loading.dismiss();

    await this.clinicService.deleteClinic(id).subscribe(
      res => {
        if (res.IsSuccess) {
          // loading.dismiss();
        } else {
          // loading.dismiss();
          this.toastService.create(res.Message, "danger");
        }
      },
      err => {
        // loading.dismiss();
        this.toastService.create(err, "danger");
      }
    );
  }
}
