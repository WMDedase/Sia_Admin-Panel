<script setup>
import { ref, onMounted } from 'vue';
import { fetchCurrentUser } from '../services/api';

const currentUser = ref(null);
const loading = ref(true);
const error = ref(null);
const guidanceStatus = ref('Not Cleared');
const clinicStatus = ref('Not Cleared');
const libraryStatus = ref('Not Cleared');
const inventoryStatus = ref(null);  // Initialize without a default status

// Registrar requirements statuses
const psaStatus = ref('Pending');
const goodMoralStatus = ref('Pending');
const torStatus = ref('Pending');

onMounted(async () => {
  try {
    const response = await fetchCurrentUser();
    console.log('API response:', response);

    if (response.student_profile) {
      currentUser.value = response.student_profile;

      // Set the statuses for PSA, Good Moral, and TOR
      psaStatus.value = response.student_profile.psa || 'Pending';
      goodMoralStatus.value = response.student_profile.goodmoral || 'Pending';
      torStatus.value = response.student_profile.tor || 'Pending';

      // Guidance status logic
      if (!response.student_profile.guidance || response.student_profile.guidance.length === 0) {
        guidanceStatus.value = 'Cleared';
      } else {
        guidanceStatus.value = response.student_profile.guidance.case_status === 1 ? 'Cleared' : 'Not Cleared';
      }

      // Clinic status logic
      if (response.student_profile.physical_exam && Object.keys(response.student_profile.physical_exam).length > 0) {
        clinicStatus.value = 'Cleared';
      } else {
        clinicStatus.value = 'Not Cleared';
      }

      // Library status logic
      if (response.student_profile.library && response.student_profile.library.status) {
        libraryStatus.value = response.student_profile.library.status;
      } else {
        libraryStatus.value = 'Not Cleared';
      }

      // Inventory status logic
      if (response.student_profile.inventory && response.student_profile.inventory.length > 0) {
        inventoryStatus.value = 'Not Cleared'; // Set status to 'Cleared' if there are inventory records
      } else {
        inventoryStatus.value = 'Cleared'; // Set status to 'Not Cleared' if no records are found
      }

      console.log('Current user data:', currentUser.value);
    } else {
      error.value = 'No student data found';
      guidanceStatus.value = 'Cleared';
      clinicStatus.value = 'Not Cleared';
      libraryStatus.value = 'Not Cleared';
      inventoryStatus.value = 'Not Cleared';
    }
  } catch (err) {
    error.value = 'Failed to fetch current user';
    console.error('Error:', err);
    guidanceStatus.value = 'Cleared';
    clinicStatus.value = 'Not Cleared';
    libraryStatus.value = 'Not Cleared';
    inventoryStatus.value = 'Not Cleared';
  } finally {
    loading.value = false;
  }
});
</script>


<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title">DASHBOARD</h1>
      <div class="studentProfile">
        <span class="material-icons">grid_view</span>
        <span class="text fw-bolder">Dashboard</span>
      </div>
    </div>
    <hr>

    <div class="bottom-container">
      <div class="top">
      
        <div class="totals">
          <h3><span class="material-icons">school</span>Totals Information</h3>

          <div class="account">
            <h3>Total Accounts</h3>
            <h5>0000</h5>
          </div>

          <div class="sub-total">

          
          <div class="student">
            <h3>Total Students</h3>
            <h5>0000</h5>
          </div>
          <div class="faculty">
            <h3>Total Faculty Member</h3>
            <h5>0000</h5>
          </div>
          <div class="personnel">
            <h3>Total Personnel</h3>
            <h5>0000</h5>
          </div>
        </div>
        </div>

      </div>

      <div class="bottom">
        <h3><span class="material-icons">school</span>Accounts Total Information</h3>

        <BarChart
        :juniorHighData="juniorHighData"
        :seniorHighData="seniorHighData"/>
      </div>
    </div>
  </main>
</template>


<script>
import BarChart from '../components/BarChart.vue';
export default {
  components: {
    BarChart ,
  }
};
</script>
<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
}

.top-container {
  display: flex;
  margin: 0.5rem;

  .bg-title {
    z-index: -1;
    position: absolute;
    opacity: 6%;
    margin-top: -40px;
    font-size: 100px;
    font-family: Impact, fantasy;
  }

  .studentProfile {
    flex: 1;

    .material-icons {
      position: relative;
      color: var(--dark);
      font-size: 2rem;
      top: 4px;
    }

    .text {
      position: relative;
      color: var(--dark);
      font-size: 2.2rem;
      font-weight: 900;
      bottom: 0.1rem;
      left: 0.2rem;
      text-shadow: 0 1px 1px;
    }
  }
}

.bottom-container {
  display: flex;
  flex-direction: column;
  gap: 5rem;

  h3 {
    text-shadow: 0 0 1px;
    font-size: 20px;
    position:relative;
    bottom: 15px;
    color: var(--dark);
    .material-icons{
      position:relative;
      font-size: 35px;
      top: 12px;
      right: 2px;
    }
  }

  .top {

    .totals{
      display: flex;
      flex-direction: column;
      gap: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 2rem;
      border-top: 8px solid var(--dark);
      border-radius: 10px;

      .account{
        align-self: center;
        padding: 2rem;
        border-radius: 10px;
        h3{
          color: var(--dark);
          font-size: 35px;
        }
  
        h5{
          text-align: center;
          font-size:30px;
          font-weight: 700;
        }
      }

      .sub-total{
        display: flex;
        gap: 3rem;
        justify-content: center;

        h3{
          font-size:25px;
          color: var(--dark);

        }

        h5{
          font-size: 23px;
          text-align: center;
          font-weight: 700;
        }
      .student{
        padding: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        border-top: 8px solid var(--dark);
      }

      .faculty{
        padding: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        border-top: 8px solid var(--dark);
      }

      .personnel{
        padding: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        border-top: 8px solid var(--dark);

      }

      }
    }



  }
  .bottom{
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 2rem;
    border-left: 8px solid var(--dark);
    border-right: 8px solid var(--dark);

    border-radius: 10px;

  }
}
</style>

