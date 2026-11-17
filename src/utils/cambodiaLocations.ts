import { CambodiaStop } from '../types/gps';

export interface ProvincialCapital extends CambodiaStop {
  capitalNameKm: string;
  capitalNameEn: string;
  highway: string;
  branchAddressKm?: string;
  branchPhone?: string;
}

// Comprehensive Directory of Vireak Buntham Express (VET) Branches & Terminals across Cambodia
export const CAMBODIA_STOPS: ProvincialCapital[] = [
  // === PREAH SIHANOUK BRANCHES ===
  {
    id: 'sihanoukville',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងព្រះសីហនុ (តោពីរ)',
    nameEn: 'VET Sihanoukville (Golden Lions)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ព្រះសីហនុ (តោពីរ)',
    capitalNameEn: 'VET Sihanoukville Golden Lions Branch',
    provinceKm: 'ខេត្តព្រះសីហនុ',
    provinceEn: 'Preah Sihanouk',
    highway: 'ផ្លូវល្បឿនលឿន / NR4',
    branchPhone: '081 999 888',
    lat: 10.6158,
    lng: 103.5262
  },
  {
    id: 'vet_shv_bus_station',
    nameKm: 'សាខា វីរៈប៊ុនថាំ បេនឡានក្រុងព្រះសីហនុ',
    nameEn: 'VET Sihanoukville Main Bus Terminal',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ បេនឡានព្រះសីហនុ',
    capitalNameEn: 'VET Sihanoukville Main Terminal',
    provinceKm: 'ខេត្តព្រះសីហនុ',
    provinceEn: 'Preah Sihanouk',
    highway: 'ផ្លូវជាតិលេខ ៤ (NR4)',
    branchPhone: '081 999 888',
    lat: 10.6358,
    lng: 103.5241
  },
  {
    id: 'vet_shv_port',
    nameKm: 'សាខា វីរៈប៊ុនថាំ កំពង់ផែកោះរ៉ុង (ព្រះសីហនុ)',
    nameEn: 'VET Sihanoukville Autonomous Port (Koh Rong Pier)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ កំពង់ផែព្រះសីហនុ',
    capitalNameEn: 'VET Sihanoukville Port Pier',
    provinceKm: 'ខេត្តព្រះសីហនុ',
    provinceEn: 'Preah Sihanouk',
    highway: 'ផ្លូវល្បឿនលឿន / កំពង់ផែ',
    branchPhone: '081 999 888',
    lat: 10.6495,
    lng: 103.5162
  },
  {
    id: 'vet_shv_prey_nob',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ព្រៃនប់ (ព្រះសីហនុ)',
    nameEn: 'VET Prey Nob Branch (NR4)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ព្រៃនប់',
    capitalNameEn: 'VET Prey Nob Branch',
    provinceKm: 'ខេត្តព្រះសីហនុ',
    provinceEn: 'Preah Sihanouk',
    highway: 'ផ្លូវជាតិលេខ ៤ (NR4)',
    lat: 10.6594,
    lng: 103.7812
  },

  // === PHNOM PENH BRANCHES ===
  {
    id: 'phnom_penh',
    nameKm: 'សាខា វីរៈប៊ុនថាំ គល់ស្ពានជ្រោយចង្វារ (ស្តាតចាស់)',
    nameEn: 'VET Phnom Penh (Old Stadium / Chroy Changvar)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ រង្វង់មូលស្តាតចាស់',
    capitalNameEn: 'VET Old Stadium Roundabout Hub',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'NR5 / NR6A គល់ស្ពានជ្រោយចង្វារ',
    branchPhone: '081 999 888',
    lat: 11.5848,
    lng: 104.9161
  },
  {
    id: 'vet_pp_chroy_changvar_6a',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ជ្រោយចង្វារ ផ្លូវ 6A (VIP Station)',
    nameEn: 'VET Chroy Changvar NR6A VIP Terminal',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ជ្រោយចង្វារ 6A',
    capitalNameEn: 'VET Chroy Changvar 6A Terminal',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'ផ្លូវជាតិលេខ 6A (NR6A)',
    lat: 11.5975,
    lng: 104.9318
  },
  {
    id: 'vet_pp_riverside',
    nameKm: 'សាខា វីរៈប៊ុនថាំ មាត់ទន្លេ (ផ្សាររាត្រី ភ្នំពេញ)',
    nameEn: 'VET Phnom Penh Riverside (Night Market)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ មាត់ទន្លេ ផ្សាររាត្រី',
    capitalNameEn: 'VET Riverside Night Market',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'តីរវិថីព្រះស៊ីសុវត្ថិ (Riverside)',
    lat: 11.5732,
    lng: 104.9265
  },
  {
    id: 'vet_pp_olympic',
    nameKm: 'សាខា វីរៈប៊ុនថាំ អូឡាំពិក (ភ្នំពេញ)',
    nameEn: 'VET Phnom Penh Olympic Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ អូឡាំពិក',
    capitalNameEn: 'VET Olympic Branch',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'មហាវិថីព្រះសីហនុ (Olympic)',
    lat: 11.5542,
    lng: 104.9126
  },
  {
    id: 'vet_pp_chaom_chao',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ចោមចៅ (ភ្នំពេញ)',
    nameEn: 'VET Chaom Chao Roundabout Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ចោមចៅ',
    capitalNameEn: 'VET Chaom Chao Hub',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'ផ្លូវជាតិលេខ ៣ & ៤ (NR3 / NR4)',
    lat: 11.5318,
    lng: 104.8265
  },
  {
    id: 'vet_pp_kambol',
    nameKm: 'សាខា វីរៈប៊ុនថាំ កំបូល (ច្រកផ្លូវល្បឿនលឿន)',
    nameEn: 'VET Kambol Expressway Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ កំបូល',
    capitalNameEn: 'VET Kambol Expressway Hub',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'ផ្លូវល្បឿនលឿន / NR4',
    lat: 11.5214,
    lng: 104.7795
  },
  {
    id: 'vet_pp_chbar_ampov',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ច្បារអំពៅ (ផ្លូវជាតិលេខ 1)',
    nameEn: 'VET Chbar Ampov NR1 Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ច្បារអំពៅ',
    capitalNameEn: 'VET Chbar Ampov NR1',
    provinceKm: 'រាជធានីភ្នំពេញ',
    provinceEn: 'Phnom Penh',
    highway: 'ផ្លូវជាតិលេខ ១ (NR1)',
    lat: 11.5305,
    lng: 104.9482
  },

  // === SIEM REAP BRANCHES ===
  {
    id: 'siem_reap',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសៀមរាប (ផ្លូវជាតិលេខ 6)',
    nameEn: 'VET Siem Reap Main Terminal (NR6)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសៀមរាប',
    capitalNameEn: 'VET Siem Reap Main Terminal',
    provinceKm: 'ខេត្តសៀមរាប',
    provinceEn: 'Siem Reap',
    highway: 'ផ្លូវជាតិលេខ ៦ (NR6)',
    lat: 13.3618,
    lng: 103.8606
  },
  {
    id: 'vet_sr_chreav',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ជ្រាវ សៀមរាប (ផ្លូវជាស៊ីម)',
    nameEn: 'VET Siem Reap Chreav VIP Terminal',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ជ្រាវ សៀមរាប',
    capitalNameEn: 'VET Siem Reap Chreav Station',
    provinceKm: 'ខេត្តសៀមរាប',
    provinceEn: 'Siem Reap',
    highway: 'ផ្លូវជាស៊ីម ក្រុងសៀមរាប',
    lat: 13.3423,
    lng: 103.8839
  },
  {
    id: 'vet_sr_pub_street',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ផ្សារចាស់ / ផាប់ស្ទ្រីត (សៀមរាប)',
    nameEn: 'VET Siem Reap Old Market / Pub Street',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ផ្សារចាស់ សៀមរាប',
    capitalNameEn: 'VET Old Market Siem Reap',
    provinceKm: 'ខេត្តសៀមរាប',
    provinceEn: 'Siem Reap',
    highway: 'កណ្តាលក្រុងសៀមរាប',
    lat: 13.3541,
    lng: 103.8552
  },

  // === BATTAMBANG & POIPET BRANCHES ===
  {
    id: 'battambang',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងបាត់ដំបង (ផ្លូវជាតិលេខ 5)',
    nameEn: 'VET Battambang Main Terminal (614 NR5)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងបាត់ដំបង',
    capitalNameEn: 'VET Battambang Main Station',
    provinceKm: 'ខេត្តបាត់ដំបង',
    provinceEn: 'Battambang',
    highway: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    lat: 13.0965,
    lng: 103.2079
  },
  {
    id: 'poipet',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងប៉ោយប៉ែត (ច្រកព្រំដែន)',
    nameEn: 'VET Poipet Border Terminal',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងប៉ោយប៉ែត',
    capitalNameEn: 'VET Poipet Border Station',
    provinceKm: 'ខេត្តបន្ទាយមានជ័យ',
    provinceEn: 'Banteay Meanchey',
    highway: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    lat: 13.6561,
    lng: 102.5647
  },
  {
    id: 'banteay_meanchey',
    nameKm: 'សាខា វីរៈប៊ុនថាំ សិរីសោភ័ណ (បន្ទាយមានជ័យ)',
    nameEn: 'VET Serei Saophoan (Sisophon)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ សិរីសោភ័ណ',
    capitalNameEn: 'VET Sisophon Branch',
    provinceKm: 'ខេត្តបន្ទាយមានជ័យ',
    provinceEn: 'Banteay Meanchey',
    highway: 'ផ្លូវជាតិលេខ ៥ & ៦ (NR5/NR6)',
    lat: 13.5859,
    lng: 102.9737
  },

  // === KAMPOT, KEP & KOH KONG BRANCHES ===
  {
    id: 'kampot',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកំពត (រង្វង់មូលទុរេន)',
    nameEn: 'VET Kampot (Durian Roundabout)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកំពត',
    capitalNameEn: 'VET Kampot Main Terminal',
    provinceKm: 'ខេត្តកំពត',
    provinceEn: 'Kampot',
    highway: 'ផ្លូវជាតិលេខ ៣ (NR3)',
    lat: 10.6104,
    lng: 104.1818
  },
  {
    id: 'kep',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកែប (ឆ្នេរកែប)',
    nameEn: 'VET Kep Beach Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកែប',
    capitalNameEn: 'VET Kep Provincial Branch',
    provinceKm: 'ខេត្តកែប',
    provinceEn: 'Kep',
    highway: 'ផ្លូវជាតិលេខ ៣៣ (NR33)',
    lat: 10.4833,
    lng: 104.3167
  },
  {
    id: 'koh_kong',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងខេមរភូមិន្ទ (កោះកុង)',
    nameEn: 'VET Koh Kong Main Terminal',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តកោះកុង',
    capitalNameEn: 'VET Koh Kong Station',
    provinceKm: 'ខេត្តកោះកុង',
    provinceEn: 'Koh Kong',
    highway: 'ផ្លូវជាតិលេខ ៤៨ (NR48)',
    lat: 11.6153,
    lng: 102.9838
  },
  {
    id: 'vet_sre_ambel',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ស្រែអំបិល (កោះកុង)',
    nameEn: 'VET Sre Ambel Branch (NR48)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ស្រែអំបិល',
    capitalNameEn: 'VET Sre Ambel Hub',
    provinceKm: 'ខេត្តកោះកុង',
    provinceEn: 'Koh Kong',
    highway: 'ផ្លូវជាតិលេខ ៤ & ៤៨',
    lat: 11.1192,
    lng: 103.7584
  },

  // === KAMPONG CHAM, KAMPONG THOM & CENTRAL BRANCHES ===
  {
    id: 'kampong_cham',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកំពង់ចាម (គល់ស្ពានគីហ្សូណា)',
    nameEn: 'VET Kampong Cham (Kizuna Bridge)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកំពង់ចាម',
    capitalNameEn: 'VET Kampong Cham Terminal',
    provinceKm: 'ខេត្តកំពង់ចាម',
    provinceEn: 'Kampong Cham',
    highway: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    lat: 11.9934,
    lng: 105.4635
  },
  {
    id: 'vet_skun',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ផ្សារស្គន់ (ជើងព្រៃ កំពង់ចាម)',
    nameEn: 'VET Skun Junction Branch (NR6/NR7)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ផ្សារស្គន់',
    capitalNameEn: 'VET Skun Hub',
    provinceKm: 'ខេត្តកំពង់ចាម',
    provinceEn: 'Kampong Cham',
    highway: 'ផ្លូវបំបែក NR6 & NR7',
    lat: 12.0621,
    lng: 105.0694
  },
  {
    id: 'kampong_thom',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងស្ទឹងសែន (កំពង់ធំ)',
    nameEn: 'VET Kampong Thom (Steung Saen)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកំពង់ធំ',
    capitalNameEn: 'VET Kampong Thom Station',
    provinceKm: 'ខេត្តកំពង់ធំ',
    provinceEn: 'Kampong Thom',
    highway: 'ផ្លូវជាតិលេខ ៦ (NR6)',
    lat: 12.7111,
    lng: 104.8887
  },
  {
    id: 'kampong_speu',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងច្បារមន (កំពង់ស្ពឺ)',
    nameEn: 'VET Kampong Speu (Chbar Mon)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តកំពង់ស្ពឺ',
    capitalNameEn: 'VET Kampong Speu Branch',
    provinceKm: 'ខេត្តកំពង់ស្ពឺ',
    provinceEn: 'Kampong Speu',
    highway: 'ផ្លូវជាតិលេខ ៤ (NR4)',
    lat: 11.4533,
    lng: 104.5208
  },
  {
    id: 'kampong_chhnang',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងកំពង់ឆ្នាំង',
    nameEn: 'VET Kampong Chhnang Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តកំពង់ឆ្នាំង',
    capitalNameEn: 'VET Kampong Chhnang',
    provinceKm: 'ខេត្តកំពង់ឆ្នាំង',
    provinceEn: 'Kampong Chhnang',
    highway: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    lat: 12.2500,
    lng: 104.6667
  },
  {
    id: 'pursat',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងពោធិ៍សាត់',
    nameEn: 'VET Pursat Main Terminal (NR5)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តពោធិ៍សាត់',
    capitalNameEn: 'VET Pursat Station',
    provinceKm: 'ខេត្តពោធិ៍សាត់',
    provinceEn: 'Pursat',
    highway: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    lat: 12.5388,
    lng: 103.9192
  },

  // === NORTHEAST & NORTHERN BRANCHES ===
  {
    id: 'kratie',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងក្រចេះ',
    nameEn: 'VET Kratie Provincial Terminal',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តក្រចេះ',
    capitalNameEn: 'VET Kratie Branch',
    provinceKm: 'ខេត្តក្រចេះ',
    provinceEn: 'Kratie',
    highway: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    lat: 12.4881,
    lng: 106.0188
  },
  {
    id: 'mondulkiri',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសែនមនោរម្យ (មណ្ឌលគិរី)',
    nameEn: 'VET Mondulkiri (Sen Monorom)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តមណ្ឌលគិរី',
    capitalNameEn: 'VET Sen Monorom Branch',
    provinceKm: 'ខេត្តមណ្ឌលគិរី',
    provinceEn: 'Mondulkiri',
    highway: 'ផ្លូវជាតិលេខ ៧៦ (NR76)',
    lat: 12.4558,
    lng: 107.1881
  },
  {
    id: 'ratanakiri',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងបានលុង (រតនគិរី)',
    nameEn: 'VET Ratanakiri (Banlung)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តរតនគិរី',
    capitalNameEn: 'VET Banlung Terminal',
    provinceKm: 'ខេត្តរតនគិរី',
    provinceEn: 'Ratanakiri',
    highway: 'ផ្លូវជាតិលេខ ៧៨ (NR78)',
    lat: 13.7394,
    lng: 106.9873
  },
  {
    id: 'stung_treng',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងស្ទឹងត្រែង',
    nameEn: 'VET Stung Treng Main Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តស្ទឹងត្រែង',
    capitalNameEn: 'VET Stung Treng Station',
    provinceKm: 'ខេត្តស្ទឹងត្រែង',
    provinceEn: 'Stung Treng',
    highway: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    lat: 13.5259,
    lng: 105.9683
  },
  {
    id: 'preah_vihear',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងព្រះវិហារ',
    nameEn: 'VET Preah Vihear Provincial Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តព្រះវិហារ',
    capitalNameEn: 'VET Preah Vihear Branch',
    provinceKm: 'ខេត្តព្រះវិហារ',
    provinceEn: 'Preah Vihear',
    highway: 'ផ្លូវជាតិលេខ ៦២ (NR62)',
    lat: 13.8073,
    lng: 104.9805
  },
  {
    id: 'oddar_meanchey',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសំរោង (ឧត្តរមានជ័យ)',
    nameEn: 'VET Oddar Meanchey (Samraong)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសំរោង',
    capitalNameEn: 'VET Samraong Branch',
    provinceKm: 'ខេត្តឧត្តរមានជ័យ',
    provinceEn: 'Oddar Meanchey',
    highway: 'ផ្លូវជាតិលេខ ៦៨ (NR68)',
    lat: 14.1818,
    lng: 103.5176
  },
  {
    id: 'pailin',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងប៉ៃលិន',
    nameEn: 'VET Pailin Provincial Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តប៉ៃលិន',
    capitalNameEn: 'VET Pailin Station',
    provinceKm: 'ខេត្តប៉ៃលិន',
    provinceEn: 'Pailin',
    highway: 'ផ្លូវជាតិលេខ ៥៧ (NR57)',
    lat: 12.8489,
    lng: 102.6093
  },

  // === SOUTHEAST & SOUTHERN BRANCHES ===
  {
    id: 'tboung_khmum',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសួង (ត្បូងឃ្មុំ)',
    nameEn: 'VET Suong Branch (Tboung Khmum)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងសួង',
    capitalNameEn: 'VET Suong Branch',
    provinceKm: 'ខេត្តត្បូងឃ្មុំ',
    provinceEn: 'Tboung Khmum',
    highway: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    lat: 11.9070,
    lng: 105.6534
  },
  {
    id: 'svay_rieng',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងស្វាយរៀង',
    nameEn: 'VET Svay Rieng Branch (NR1)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តស្វាយរៀង',
    capitalNameEn: 'VET Svay Rieng Branch',
    provinceKm: 'ខេត្តស្វាយរៀង',
    provinceEn: 'Svay Rieng',
    highway: 'ផ្លូវជាតិលេខ ១ (NR1)',
    lat: 11.0879,
    lng: 105.7993
  },
  {
    id: 'vet_bavet',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងបាវិត (ច្រកព្រំដែន)',
    nameEn: 'VET Bavet Border Terminal (NR1)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងបាវិត',
    capitalNameEn: 'VET Bavet Border Station',
    provinceKm: 'ខេត្តស្វាយរៀង',
    provinceEn: 'Svay Rieng',
    highway: 'ផ្លូវជាតិលេខ ១ (NR1)',
    lat: 11.0734,
    lng: 106.1668
  },
  {
    id: 'prey_veng',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងព្រៃវែង',
    nameEn: 'VET Prey Veng Provincial Branch',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តព្រៃវែង',
    capitalNameEn: 'VET Prey Veng Branch',
    provinceKm: 'ខេត្តព្រៃវែង',
    provinceEn: 'Prey Veng',
    highway: 'ផ្លូវជាតិលេខ ១១ (NR11)',
    lat: 11.4868,
    lng: 105.3253
  },
  {
    id: 'takeo',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងដូនកែវ (តាកែវ)',
    nameEn: 'VET Takeo (Doun Kaev)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ខេត្តតាកែវ',
    capitalNameEn: 'VET Takeo Branch',
    provinceKm: 'ខេត្តតាកែវ',
    provinceEn: 'Takeo',
    highway: 'ផ្លូវជាតិលេខ ២ (NR2)',
    lat: 10.9908,
    lng: 104.7850
  },
  {
    id: 'kandal',
    nameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងតាខ្មៅ (កណ្តាល)',
    nameEn: 'VET Ta Khmau Branch (Kandal)',
    capitalNameKm: 'សាខា វីរៈប៊ុនថាំ ក្រុងតាខ្មៅ',
    capitalNameEn: 'VET Ta Khmau Branch',
    provinceKm: 'ខេត្តកណ្តាល',
    provinceEn: 'Kandal',
    highway: 'ផ្លូវជាតិលេខ ២ / ២១ (NR2)',
    lat: 11.4833,
    lng: 104.9500
  }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateRoadDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const straight = calculateDistanceKm(lat1, lon1, lat2, lon2);
  return Math.round(straight * 1.24 * 10) / 10;
}

export interface RealRoadRouteResult {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][];
  isRealOsrm: boolean;
}

const routeCache = new Map<string, RealRoadRouteResult>();

export async function fetchRealRoadRoute(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<RealRoadRouteResult> {
  const cacheKey = `${fromLat.toFixed(3)},${fromLng.toFixed(3)}->${toLat.toFixed(3)},${toLng.toFixed(3)}`;
  const cached = routeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=simplified&geometries=geojson`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMinutes = Math.max(1, Math.round(route.duration / 60));
        const coords: [number, number][] = route.geometry?.coordinates
          ? route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number])
          : [
              [fromLat, fromLng],
              [toLat, toLng]
            ];

        const result: RealRoadRouteResult = {
          distanceKm,
          durationMinutes,
          geometry: coords,
          isRealOsrm: true
        };
        routeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch {}

  const fallbackDist = estimateRoadDistanceKm(fromLat, fromLng, toLat, toLng);
  return {
    distanceKm: fallbackDist,
    durationMinutes: Math.max(1, Math.round((fallbackDist / 58) * 60)),
    geometry: [
      [fromLat, fromLng],
      [toLat, toLng]
    ],
    isRealOsrm: false
  };
}

export function getNearestAndTargetStops(currentLat: number, currentLng: number, targetStopId?: string) {
  let closestStop = CAMBODIA_STOPS[0];
  let minDistance = Infinity;

  for (const stop of CAMBODIA_STOPS) {
    const dist = calculateDistanceKm(currentLat, currentLng, stop.lat, stop.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestStop = stop;
    }
  }

  let target = CAMBODIA_STOPS.find(s => s.id === targetStopId);
  if (!target) {
    target =
      CAMBODIA_STOPS.find(
        s => s.id !== closestStop.id && calculateDistanceKm(currentLat, currentLng, s.lat, s.lng) > 25
      ) || CAMBODIA_STOPS[0];
  }

  const straightDistanceToTarget = calculateDistanceKm(currentLat, currentLng, target.lat, target.lng);
  const roadDistanceToTarget = estimateRoadDistanceKm(currentLat, currentLng, target.lat, target.lng);

  return {
    closestStop,
    distanceToClosest: minDistance,
    targetStop: target,
    distanceToTarget: roadDistanceToTarget,
    straightDistanceToTarget
  };
}

export function calculateETA(
  roadDistanceKm: number,
  currentSpeed: number,
  osrmDurationMinutes?: number
): {
  etaMinutes: number;
  hoursPart: number;
  minsPart: number;
  etaFormattedKm: string;
  etaFormattedEn: string;
  etaFormatted: string;
  arrivalTime: string;
  arrivalTime24: string;
  effectiveSpeedKmh: number;
} {
  let effectiveSpeedKmh = 58;
  let etaMinutes = 0;

  if (currentSpeed >= 25) {
    effectiveSpeedKmh = Math.round(currentSpeed * 0.7 + 58 * 0.3);
    etaMinutes = Math.max(1, Math.round((roadDistanceKm / effectiveSpeedKmh) * 60));
  } else if (osrmDurationMinutes && osrmDurationMinutes > 0) {
    etaMinutes = Math.max(1, Math.round(osrmDurationMinutes * 1.12));
    effectiveSpeedKmh = Math.max(30, Math.round(roadDistanceKm / (etaMinutes / 60)));
  } else {
    effectiveSpeedKmh = 58;
    etaMinutes = Math.max(1, Math.round((roadDistanceKm / effectiveSpeedKmh) * 60));
  }

  if (roadDistanceKm <= 0.5) {
    etaMinutes = 0;
  }

  const now = new Date();
  const arrivalDate = new Date(now.getTime() + etaMinutes * 60000);

  const hoursPart = Math.floor(etaMinutes / 60);
  const minsPart = etaMinutes % 60;

  const etaFormattedKm =
    hoursPart > 0 ? `${hoursPart} ម៉ោង ${minsPart} នាទី` : `${minsPart} នាទី`;
  const etaFormattedEn =
    hoursPart > 0 ? `${hoursPart}h ${minsPart}m` : `${minsPart} mins`;

  const arrivalTime = arrivalDate.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const arrivalTime24 = arrivalDate.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return {
    etaMinutes,
    hoursPart,
    minsPart,
    etaFormattedKm,
    etaFormattedEn,
    etaFormatted: `${etaFormattedKm} (${etaFormattedEn})`,
    arrivalTime,
    arrivalTime24,
    effectiveSpeedKmh
  };
}
