<template>
  <main>
    <div class="top-container">
        <h1 class="bg-title">RESET SCHOOL YEAR</h1>
        <div class="studentProfile">
            <span class="material-icons">restart_alt</span>
            <span class="text fw-bolder">Reset School Year</span>   
        </div>    
    </div> 
    <hr>

    <div class="main-content">

        <div class="resetsy-table">
        </div>
    </div>

    
</main>
 
</template>

<script>
export default {
  components:{
  },
}
</script>

<style lang="scss" scoped>
.top-container{
    display: flex;
    margin: 0.5rem;
  
    .bg-title{
        z-index: -1;
        position: absolute;
        opacity: 10%;
        margin-top: -40px;
        font-size: 100px;
        font-family: Impact, fantasy;
    }
    .studentProfile{
        flex: 1;
  
        .material-icons{
            position: relative;
            color: var(--dark);
            font-size: 2rem;
            top: 4px;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 2.5rem;
            font-weight: 900;
            bottom: 0.1rem;
            left: 0.2rem;   
            text-shadow: 0 1px 1px;
  
        }
    }
  
  } 

.main-content {
    display: flex;
    flex-direction: column;

    .resetsy-table{
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
    }
}


</style>