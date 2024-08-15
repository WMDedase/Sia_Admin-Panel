<template>
    <v-container>
    <v-data-table :search="search" :headers="headers" :items="displayedStudents"
      :sort-by="[{ key: 'studentId', order: 'asc' }]">
      <!-- content of the table (top) -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="text-h6 font-weight-black" style="color: #2f3f64">USER ACCOUNTS LIST
            <v-btn class="ml-5" color="#28a745" variant="flat" dark @click="downloadXLS()">
              <v-icon left>mdi-download</v-icon>
              GENERATE REPORT
            </v-btn>
          </v-toolbar-title>
  
          <v-text-field v-model="search" class="w-auto mr-1" density="compact" label="Search"
            prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line>
          </v-text-field>
          <!-- content of the table (top) -->
  
          <!-- create new popup modal -->
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">
              <!-- card header content -->
              <v-btn class="mb-2 rounded-l" color="primary" dark v-bind="props" prepend-icon="mdi-plus">ADD USERS
              </v-btn>
  
              <!-- end of card header content -->
            </template>
  
            <v-card>
              <div style="background-color: var(--dark)">
                <v-card-title><span class="fs-3 fw-bold m-2" style="color: white">{{
                  formTitle
                }}</span></v-card-title>
              </div>
              <v-card-text>
                <v-container>
                  <label class="fw-regular fs-4 mb-3">Personal Information</label>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field v-model="editedItem.last_name" :rules="[rules.required]" label="Last Name" required
                        pattern="[A-Za-z .'-]+">
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field v-model="editedItem.first_name" label="First Name" required :rules="[rules.required]"
                        pattern="[A-Za-z .'-]+">
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field v-model="editedItem.middle_name" label="Middle Name" pattern="[A-Za-z .'-]+">
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field v-model="editedItem.extension_name" label="Extension Name" pattern="[A-Za-z .'-]+">
                      </v-text-field>
                    </v-col>
                  </v-row>
  
                  <v-divider></v-divider>
                  <label class="fw-regular fs-4 mb-3">Email and Password Information</label>
                  <v-row>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field label="Email Address" placeholder="Doe@sna.edu.ph"
                        :rules="[rules.required]"></v-text-field>
                    </v-col>
  
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field v-model="password" :rules="[rules.required, rules.min]" hint="At least 8 characters"
                        label="Password" name="input-10-1" counter></v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <!-- checkbox -->
                  <v-container class="role-panel-wrapper">
                    <!-- role and deparment checkbox -->
                    <v-container class="role-container">
                      <label class="fw-regular fs-4">Role and Department</label>
                      <br />
                      <label class="fw-light fs-6">
                        <strong>Instruction: </strong>Select the role you want to
                        assign to the user by clicking the checkbox.
                      </label>
                      <v-row>
                        <v-col cols="12" md="4" sm="4">
                          <v-checkbox color="success" v-model="selectedRole" :value="'Admin'" label="Admin"></v-checkbox>
                          <v-checkbox color="success" v-model="selectedRole" :value="'Faculty'"
                            label="Faculty"></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="4" sm="4">
                          <v-checkbox color="success" v-model="selectedRole" :value="'Student Personnel'"
                            label="Student Personnel"></v-checkbox>
                          <v-checkbox color="success" v-model="selectedRole" :value="'Encoder'"
                            label="Encoder"></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="4" sm="4">
                          <v-checkbox color="success" v-model="selectedRole" :value="'Verifier'"
                            label="Verifier"></v-checkbox>
                          <v-checkbox color="success" v-model="selectedRole" :value="'Accessor'"
                            label="Accessor"></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-container>
                    <!-- end role and deparment checkbox -->
  
                    <!-- panel checkbox -->
                    <v-container class="panel-container">
                      <label class="fw-regular fs-4">Panel</label>
                      <br />
                      <label class="fw-light fs-6">
                        <strong>Instruction: </strong>Select the panel you want to
                        assign to the user by clicking the checkbox.
                      </label>
                      <v-row>
                        <v-col cols="12" md="4" sm="4">
                          <v-checkbox color="success" v-model="selectedPanel" :value="'Admin'" label="Admin"></v-checkbox>
                          <v-checkbox color="success" v-model="selectedPanel" :value="'Faculty'"
                            label="Faculty"></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="4" sm="4">
                          <v-checkbox color="success" v-model="selectedPanel" :value="'Student Personnel'"
                            label="Student Personnel"></v-checkbox>
                          <v-checkbox color="success" v-model="selectedPanel" :value="'Encoder'"
                            label="Encoder"></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="4" sm="4">
                          <v-checkbox color="success" v-model="selectedPanel" :value="'Verifier'"
                            label="Verifier"></v-checkbox>
                          <v-checkbox color="success" v-model="selectedPanel" :value="'Accessor'"
                            label="Accessor"></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-container>
                    <!-- end panel checkbox -->
                  </v-container>
  
                  <!-- checkbox -->
                </v-container>
              </v-card-text>
  
              <!-- card buttons -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="bg-green" color="bwhite" variant="text" @click="confirmSave">Save</v-btn>
                <v-btn class="bg-red" color="white" variant="text" @click="close">Cancel</v-btn>
              </v-card-actions>
              <!-- card buttons -->
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
  
      <!-- header content -->
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-center">{{ item.id }}</td>
          <td class="text-center">
            {{ item.name}},
          </td>
          <td class="text-center">{{ item.email }}</td>
          <td class="text-center">{{ item.department }}</td>
          <td class="text-center">
            <v-btn class="ma-2" size="small" color="primary" @click="openViewDialog">
              <v-icon icon="mdi-eye" start></v-icon>
              View
            </v-btn>
            <v-btn class="ma-2" size="small" color="#D6E200" @click="openEditDialog">
              <v-icon icon="mdi-pencil" start></v-icon>
              Edit
            </v-btn> -->
          </td>
        </tr>
      </template>
  
      <!-- end of header content -->
    </v-data-table>
  
    <!-- view user status modal pop -->
    <v-dialog v-model="viewDialog" max-width="1000">
      <v-card>
        <div style="background-color: var(--dark); color: white">
          <v-card-title class="dialog-title fs-3 font-weight-black">
            FACULTY INFORMATION
          </v-card-title>
        </div>
        <v-card-text>
          <v-container>
            <label class="fw-regular fs-4 mb-3">Personal Information</label>
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.last_name" label="Last Name" readonly>
                </v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.first_name" label="First Name" readonly>
                </v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.middle_name" label="Middle Name">
                </v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.extension_name" label="Extension Name" readonly>
                </v-text-field>
              </v-col>
            </v-row>
  
            <v-divider></v-divider>
            <label class="fw-regular fs-4 mb-3">Email and Password Information</label>
            <v-row>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="Email Address" model-value="Doe" v-model="selectedStudent.email"
                  readonly></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.password" label="Password" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- checkbox -->
            <v-container class="role-panel-wrapper">
              <!-- role and deparment checkbox -->
              <v-container class="role-container">
                <label class="fw-regular fs-4">Role and Department</label>
                <br />
                <label class="fw-light fs-6">
                  <strong>Instruction: </strong>Select the role you want to assign
                  to the user by clicking the checkbox.
                </label>
                <v-row>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Admin'" label="Admin"
                      readonly></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Faculty'" label="Faculty"
                      readonly></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Student Personnel'"
                      label="Student Personnel" readonly></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Encoder'" label="Encoder"
                      readonly></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Verifier'" label="Verifier"
                      readonly></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Accessor'" label="Accessor"
                      readonly></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
              <!-- end role and deparment checkbox -->
  
              <!-- panel checkbox -->
              <v-container class="panel-container">
                <label class="fw-regular fs-4">Panel</label>
                <br />
                <label class="fw-light fs-6">
                  <strong>Instruction: </strong>Select the panel you want to
                  assign to the user by clicking the checkbox.
                </label>
                <v-row>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.panel" :value="'Admin'" label="Admin"
                      readonly></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Faculty'" label="Faculty"
                      readonly></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Student Personnel'"
                      label="Student Personnel" readonly></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Encoder'" label="Encoder"
                      readonly></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Verifier'" label="Verifier"
                      readonly></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Accessor'" label="Accessor"
                      readonly></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
              <!-- end panel checkbox -->
            </v-container>
  
            <!-- checkbox -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
  
          <v-btn class="bg-red" color="white" variant="text" @click="closeViewDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end of VIEW dialog -->
    <v-dialog v-model="editDialog" max-width="1000">
      <v-card>
        <div style="background-color: var(--dark); color: white">
          <v-card-title class="dialog-title fs-3 font-weight-black">
            FACULTY INFORMATION
          </v-card-title>
        </div>
        <v-card-text>
          <v-container>
            <label class="fw-regular fs-4 mb-3">Personal Information</label>
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.last_name" label="Last Name">
                </v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.first_name" label="First Name">
                </v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.middle_name" label="Middle Name">
                </v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.extension_name" label="Extension Name">
                </v-text-field>
              </v-col>
            </v-row>
  
            <v-divider></v-divider>
            <label class="fw-regular fs-4 mb-3">Email and Password Information</label>
            <v-row>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="Email Address" model-value="Doe" v-model="selectedStudent.email"></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="selectedStudent.password" label="Password"></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- checkbox -->
            <v-container class="role-panel-wrapper">
              <!-- role and deparment checkbox -->
              <v-container class="role-container">
                <label class="fw-regular fs-4">Role and Department</label>
                <br />
                <label class="fw-light fs-6">
                  <strong>Instruction: </strong>Select the role you want to assign
                  to the user by clicking the checkbox.
                </label>
                <v-row>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Admin'"
                      label="Admin"></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Faculty'"
                      label="Faculty"></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Student Personnel'"
                      label="Student Personnel"></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Encoder'"
                      label="Encoder"></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Verifier'"
                      label="Verifier"></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Accessor'"
                      label="Accessor"></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
              <!-- end role and deparment checkbox -->
  
              <!-- panel checkbox -->
              <v-container class="panel-container">
                <label class="fw-regular fs-4">Panel</label>
                <br />
                <label class="fw-light fs-6">
                  <strong>Instruction: </strong>Select the panel you want to
                  assign to the user by clicking the checkbox.
                </label>
                <v-row>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.panel" :value="'Admin'"
                      label="Admin"></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Faculty'"
                      label="Faculty"></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Student Personnel'"
                      label="Student Personnel"></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Encoder'"
                      label="Encoder"></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Verifier'"
                      label="Verifier"></v-checkbox>
                    <v-checkbox color="success" v-model="selectedStudent.role" :value="'Accessor'"
                      label="Accessor"></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
              <!-- end panel checkbox -->
            </v-container>
  
            <!-- checkbox -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
  
          <v-btn class="bg-green" color="white" variant="text" @click="saveChanges">Save Changes</v-btn>
  
          <v-btn class="bg-red" color="white" variant="text" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end view user status modal pop -->
     </v-container>
  </template>
  
  <script>
  import Swal from "sweetalert2";
  import axios from "axios";
  import ExcelJS from "exceljs";
  
  export default {
    data: () => ({
      search: "",
      dialog: false,
      email: "", // for email input
      dialogDelete: false,
      viewDialog: false,
      editDialog: false,
      dialogItem: [],
      selectedStudent: null,
      selectedFile: null,
      headers: [
        { title: "Employee ID", align: "center", key: "id" },
        { title: "Full Name", align: "center", key: "name" },
        { title: "Email", align: "center", key: "email" },
        { title: "Panel", align: "center", key: "department" },
        { title: "Actions", align: "center", sortable: false },
      ],
  
      students: [],
      editedIndex: -1,
      editedItem: {
        employee_id: "",
        full_name: "",
        email: "",
        password: "",
        account_role: "",
        account_dpt: "",
      },
      defaultItem: {
        employee_id: "",
        full_name: "",
        email: "",
        password: "",
        account_role: "",
        account_dpt: "",
      },
      selectedRole: "",
      selectedPanel: "",
      rules: {
        required: (value) => !!value || "Field is required", //required fields
      },
  
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    }),
  
    computed: {
      formTitle() {
        return this.editedIndex === -1
          ? "ADD USER ACCOUNT"
          : "Edit Student Information";
      },
      displayedStudents() {
        const searchTerm = this.search.toLowerCase();
        return this.students.filter((student) =>
          Object.values(student).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm)
          )
        );
      },
    },
  
    watch: {
      dialog(val) {
        val || this.close();
      },
    },
  
    mounted() {
      this.initialize();
    },
  
    methods: {
      initialize() {
        axios
          .get("getAcc")
          .then((res) => {
            this.students = res.data.user;
            console.log(this.students);
          })
          .catch((error) => {
            console.error("Error fetching students:", error);
          });
      },
  
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
  
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.selectedFile = file;
        }
      },
      close() {
        this.dialog = false;
        this.selectedFile = null;
      },
  
      confirmSave() {
        Swal.fire({
          title: "Are you sure?",
          text: "Do you want to save this user?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, save it!",
          cancelButtonText: "No, cancel!",
          customClass: {
            container: "sweet-alert-container",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.save();
            Swal.fire({
              title: "Saved!",
              text: "User has been saved.",
              icon: "success",
              customClass: {
                container: "sweet-alert-container",
              },
            });
          } else {
            Swal.fire({
              title: "Cancelled",
              text: "User was not saved.",
              icon: "error",
              customClass: {
                container: "sweet-alert-container",
              },
            });
          }
        });
      },
  
      saveChanges() {
        Swal.fire({
          title: "Do you want to save the changes?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Save",
          customClass: {
            container: "sweet-alert-container",
          },
          denyButtonText: `Don't save`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Saved!",
              icon: "success",
              customClass: {
                container: "sweet-alert-container",
              },
            });
          } else if (result.isDenied) {
            Swal.fire({
              title: "Changes are not saved",
              icon: "info",
              customClass: {
                container: "sweet-alert-container",
              },
            });
          }
        });
      },
  
      save() {
        console.log("User saved:", this.editedItem);
        this.dialog = false;
      },
      openViewDialog(item) {
        this.dialogItem = item;
        this.viewDialog = true;
      },
  
      openEditDialog(item) {
        this.selectedStudent = item;
        this.editDialog = true;
      },
  
      save() {
        // Handle the save action, including the selected file if needed
        console.log(this.selectedFile);
        this.dialog = false;
        this.selectedFile = null;
      },
  
  
      closeEditDialog() {
        console.log("selectedStudent:", this.selectedStudent); // Check the value of selectedStudent
        this.editDialog = false;
        // Clear the selected student data
      },
  
      editItem(item) {
        this.editedIndex = this.students.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
  
      archiveItem(item) {
        this.editedIndex = this.students.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
  
      deleteItemConfirm() {
        this.students.splice(this.editedIndex, 1);
        this.closeDelete();
      },
  
      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },
  
      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },
  
      save() {
        console.log(this.editedItem);
        if (this.editedIndex > -1) {
          Object.assign(this.students[this.editedIndex], this.editedItem);
        } else {
          let tmp = this.editedItem;
          this.students.push(this.editedItem);
          tmp.image = this.selectedFile;
          // console.log(this.tmp);
          axios
            .post("student", tmp)
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        this.close();
      },
  
      goView() {
        this.$router.push("/viewdetails");
      },
      getStatusColor(status) {
        if (status === "Verifying") {
          return "yellow"; // Set color to yellow if status is 'pending'
        } else if (status === "Enrolled") {
          return "green"; // Set color to green if status is 'enrolled'
        } else {
          return "red"; // Default color
        }
      },
  
      prependCountryCode() {
        if (!this.editedItem.guardian_mobileno.startsWith("+63")) {
          this.editedItem.guardian_mobileno = "+63";
        }
      },
  
      validateNumberInput(event) {
        const input = event.target.value;
        event.target.value = input.replace(/\D/g, "");
      },
  
      formatDate(event) {
        const input = event.target.value;
        const [year, month, day] = input.split("-");
        if (year && month && day) {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          this.editedItem.birth_date = `${day} ${monthNames[parseInt(month) - 1]
            } ${year}`;
        }
      },
  
      async convertExcel(data) {
        const excel = new ExcelJS.Workbook();
        const worksheet = excel.addWorksheet("Account");
  
        try {
          const imageResponse = await fetch("/src/assets/schoolLogo.png");
          const imageBlob = await imageResponse.blob();
          const imageBase64 = await this.blobToBase64(imageBlob);
  
          const logo = excel.addImage({
            base64: imageBase64,
            extension: "png",
          });
  
          worksheet.addImage(logo, {
            tl: { col: 0, row: 0 },
            ext: { width: 180, height: 120 },
            editAs: "absolute",
          });
  
          worksheet.addImage(logo, {
            tl: { col: 7, row: 0 },
            ext: { width: 180, height: 120 },
            editAs: "absolute",
          });
  
          worksheet.mergeCells("A2:J2");
          worksheet.getCell("A2").value = "Saint Nicholas Academy";
          worksheet.getCell("A2").alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          worksheet.getCell("A2").font = { size: 16, bold: true };
  
          worksheet.addRow();
  
          worksheet.mergeCells("A3:J3");
          worksheet.getCell("A3").value = "Address";
          worksheet.getCell("A3").alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          worksheet.getCell("A3").font = { size: 12 };
  
          worksheet.mergeCells("A4:J4");
          worksheet.getCell("A4").value = "Contact No";
          worksheet.getCell("A4").alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          worksheet.getCell("A4").font = { size: 12 };
  
          worksheet.addRow(); // Add an empty row for separation
  
          // Add column headers
          worksheet.addRow([
            "Employee ID",
            "Full Name",
            "Email",
            "Deparment",
          ]);
  
          // Add data rows
          data.forEach((item) => {
            worksheet.addRow([
              item.employee_id,
              item.name,
              item.email,
              item.account_dpt,
            ]);
          });
  
          return excel; // Return the excel workbook
        } catch (error) {
          console.error("Error in convertExcel:", error);
        }
      },
  
      blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]); // Split to get base64 part
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      },
  
      async downloadXLS() {
        try {
          const data = this.students; // yung data nyo dito nyo lagay
          const excel = await this.convertExcel(data); // Make sure convertExcel is awaited
  
          if (excel instanceof ExcelJS.Workbook) {
            const buffer = await excel.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Inventory.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
  
            Swal.fire({
              title: "Download Success!",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            console.error("Invalid ExcelJS.Workbook instance");
          }
        } catch (error) {
          console.error("Error downloading XLS:", error);
        }
      },
    },
  };
  </script>
  
  <style lang="scss">
  .v-data-table {
    height: 100%;
  }
  
  .student-popup {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .v-card-title {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.5rem;
  }
  
  .v-list-item-title {
    font-weight: bold;
  }
  
  .v-list-item-subtitle {
    font-size: 1rem;
    color: #2f3f64;
  }
  
  .close-button:hover {
    color: red;
  }
  
  .small-button {
    font-size: 11px;
    padding: 1px 4px;
    min-width: 60px;
  }
  
  .sweet-alert-container {
    z-index: 9999 !important;
  }
  
  .role-container,
  .panel-container {
    width: 48%;
    border-radius: 8px;
    padding: 0.5rem;
  }
  
  .role-panel-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    position: relative;
  }
  
  .role-panel-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background-color: #ccc;
  }
  
  .v-data-table__td {
    text-align: center;
  }
  </style>
  