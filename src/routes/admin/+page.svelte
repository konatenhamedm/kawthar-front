<script>
	import Abercrome from '$components/_includes/Abercrome.svelte';
	import CardStat from '$components/CardStat.svelte';
	import { getAuthCookie, logout } from '$lib/auth';
</script>

<div class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
	<Abercrome titre="Tableau de bord" parent="Dashbord" current="statistques" />
	<!-- Responsive Toggler -->
	<div class="col-span-12">
		<!-- <h1>{JSON.stringify(getAuthCookie())}</h1> -->
		<div class="grid grid-cols-12 gap-[25px]">
			<CardStat title="Total missions" total="235"  icon="uil uil-arrow-growth" />
			<CardStat title="Total missions immobilisation" total="235"  icon="uil uil-arrow-growth" />
			<CardStat title="Total missions stock" total="235"  icon="uil uil-arrow-growth" />
			<CardStat title="Montant total" total="235"  icon="uil uil-usd-circle" />
			
		</div>
	</div>
</div>
