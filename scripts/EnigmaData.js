export const enigmaData = {
	sampleFieldMessages: [
		{
			source: 'http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Decrypts#Operation_Barbarossa.2C_1941',
			model: 'I/M3',
			setup: {
				reflector:	'B',
				rotors:	['II', 'IV', 'V'],
				ringSettings:  [2, 21, 12],
				plugs:	'AV BS CG DL FU HZ IN KM OW RX'
			},
			message: {
				key: 'BLA',
				encoded: 'EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHPRKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK',
				decoded: 'AUFKLXABTEILUNGXVONXKURTINOWAXKURTINOWAXNORDWESTLXSEBEZXSEBEZXUAFFLIEGERSTRASZERIQTUNGXDUBROWKIXDUBROWKIXOPOTSCHKAXOPOTSCHKAXUMXEINSAQTDREINULLXUHRANGETRETENXANGRIFFXINFXRGTX',
			}
		},
		{
			source: 'http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages#U-264_.28Kapit.C3.A4nleutnant_Hartwig_Looks.29.2C_1942',
			model: 'M4',
			setup: {
				reflector: 'Thin-B',
				rotors: ['Beta', 'II', 'IV', 'I'],
				ringSettings: [1, 1, 1, 22],
				plugs:	'AT BL DF GJ HM NW OP QY RZ VX',
			},
			message: {
				key: 'VJNA',
				encoded: 'NCZWVUSXPNYMINHZXMQXSFWXWLKJAHSHNMCOCCAKUQPMKCSMHKSEINJUSBLKIOSXCKUBHMLLXCSJUSRRDVKOHULXWCCBGVLIYXEOAHXRHKKFVDREWEZLXOBAFGYUJQUKGRTVUKAMEURBVEKSUHHVOYHABCJWMAKLFKLMYFVNRIZRVVRTKOFDANJMOLBGFFLEOPRGTFLVRHOWOPBEKVWMUQFMPWPARMFHAGKXIIBG',
				decoded: 'VONVONJLOOKSJHFFTTTEINSEINSDREIZWOYYQNNSNEUNINHALTXXBEIANGRIFFUNTERWASSERGEDRUECKTYWABOSXLETZTERGEGNERSTANDNULACHTDREINULUHRMARQUANTONJOTANEUNACHTSEYHSDREIYZWOZWONULGRADYACHTSMYSTOSSENACHXEKNSVIERMBFAELLTYNNNNNNOOOVIERYSICHTEINSNULL',
			}
		},
		{
			source: 'http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages#Scharnhorst_.28Konteradmiral_Erich_Bey.29.2C_1943',
			model: 'M3',
			setup: {
				reflector: 'B',
				rotors: ['III', 'VI', 'VIII'],
				ringSettings: [1, 8, 13],
				plugs: 'AN EZ HK IJ LR MQ OT PV SW UX',
			},
			message: {
				key: 'UZV',
				encoded: 'YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR',
				decoded: 'STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO',
			}
		},
		{
			source: 'https://enigma.hoerenberg.com/index.php?cat=The%20U534%20messages&page=P1030662',
			model: 'M4',
			setup: {
				reflector: 'Thin-C',
				rotors: ['Beta', 'V', 'VI', 'VIII'],
				ringSettings: 'AAEL',
				plugs: 'AE BF CM DQ HU JN LX PR SZ VW',
			},
			message: {
				key: 'WIIJ',
				encoded: 'LIRZMLWRCDMSNKLKBEBHRMFQFEQAZWXBGBIEXJPYFCQAAWSEKDEACOHDZKCZTOVSYHFNSCMAIMIMMAVJNLFXEWNPUIRINOZNCRVDHCGKCYRVUJQPVKEUIVVXGLQMKRJMDMLXLLRLYBKJWRXBQRZWGCCNDOPMGCKJ',
				decoded: 'UUUVIRSIBENNULEINSYNACHRXUUUSTUETZPUNKTLUEBECKVVVCHEFVIERXUUUFLOTTXXMITUUUVIERSIBENNULZWOUNDUUUVIERSIBENNULDREIZURFLENDERWERFTLUEBECKGEHENXFONDORTFOLGTWEITERESX',
			}
		},
		{
			source: 'https://enigma.hoerenberg.com/index.php?cat=Norrk%C3%B6ping%20messages&page=PAGE_47_DOEP',
			model: 'M3',
			setup: {
				reflector: 'B',
				rotors: ['VII', 'IV', 'VI'],
				ringSettings: 'AGW',
				plugs: 'BM DX EW GP JO KV NZ RT',
			},
			message: {
				key: 'NSH',
				encoded: 'YEWZANTGDXWUVDSSYQELAMUOAMBVFZAJWFATABRMMBWXWTLFIOYBTEXXFFAOHADDXWWGBEROYDWLEUTP',
				decoded: 'KOFFERGRAMOPHONKEINSINNKTZCMYQWPJDZXQLXGJXKWXLQDHYKCMIRBYKFHCMQWHVXLRHGDXMQWCHYK',
			}
		},
		{
			source: 'https://enigma.hoerenberg.com/index.php?cat=Norrk%C3%B6ping%20messages&page=PAGE_49_KRLR',
			model: 'M3',
			setup: {
				reflector: 'B',
				rotors: ['VII', 'IV', 'VI'],
				ringSettings: 'AGW',
				plugs: 'BM DX EW GP JO KV NZ RT',
			},
			message: {
				key: 'RPR',
				encoded: 'PBQOMEWLLMJFBXKPZNBHRGLUGVHJBXYPSEACOXOTBQRWVTPVVYHLLDOCQQKIWVAMJNFADSUNAVMJGJIBMUGBWWRKJBZNHVELOGZHTISLTUWS',
				decoded: 'VERWALTUNGSAMTREICHSGERICHTARBEITSLAGERNICHTAUFSCHLAGENVCNSTDMQWZVGNVMBCPDGKPFQZWTRLDMFNGHSRDTFZGLDKCVLMNHGF',

			}

		}
	],
	sampleVerifiedMessages: [
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', ],
			model: 'I',
			setup: {
				rotors: ['II', 'IV', 'III'],
				plugs: 'IU ZM NK YH SJ DB TX RF OG QE',
				ringSettings: [22, 26, 26],
				reflector: 'A'
			},
			message: {
				key: 'ZAE',
				encoded: 'EICSSVSACTFYCNWRBCXMELAKMTBDSSPAIHMUKGFDPVEUHUDWRKOTITUTNWCEJTGUUGVVBOSVOYIDXHBRFYNOAJWISOZDIOPIXJDJJXBUYJWQRMMACUDGZCVHIFPRPCUDDWTXLCEUEASBRVOUFRTQDDOWWGCIEQSAYEXYHLCJHKWRMNQUHERAEGUXBQQDWIZYQHFJZRBZBNGWPUGLUYMUCXFKPPBWXAPRRXZLWBOFPWQHKVXWKHTNJXQCZZROWMYPLSMJINVBUCIPVYZGZXMONPMEIFWALQFEKJRRJYXVRNUFWNMPMIYBCQCJNSLNHIHOESEVNFMBKPPQTWQXQMCKIMQNPGOOTKNJDBKKHTWDUSJJGTSFJJLQ',
				decoded: 'HOWOTHERWISETHEKINGSIRHATHLAIDTHATINADOZENPASSESBETWEENYOURSELFANDHIMHESHALLNOTEXCEEDYOUTHREEHITSHEHATHLAIDONTWELVEFORNINEANDITWOULDCOMETOIMMEDIATETRIALIFYOURLORDSHIPWOULDVOUCHSAFETHEANSWERBYTHELORDHORATIOTHESETHREEYEARSIHAVETAKENANOTEOFITTHEAGEISGROWNSOPICKEDTHATTHETOEOFTHEPEASANTCOMESSONEARTHEHEELOFTHECOURTIERHEGAFFSHISKIBETHYSTATEISTHEMOREGRACIOUSFORTISAVICETOKNOWHIM'
			}

		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'http://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-u_v26_en.html'],
			model: 'I',
			setup: {
				rotors: ['III', 'IV', 'I'],
				plugs: 'EL ID YR QP FX HO KJ NS BV WU',
				ringSettings: [10, 22, 8],
				reflector: 'B'
			},
			message: {
				key: 'OAK',
				encoded: 'RXDVNGAFUCJOOJHUZZKLZLCIVQZQUJYGRAQSUQWSWFCGJXGDGWWQMTYTLLLGTLWVCSQQITTKGOEDMERMCMPERRYAZKEDRFSDKWVQUSMGFXLJFOWKIUMTJXKQDBHGPJUKQRTSBTZ',
				decoded: 'GOODEVENSIRMAYONEBEPARDONDANDRETAINTHEOFFENCEHOWLONGHATHSHEBEENTHUSTHOUGHTANDAFFLICTIONPASSIONHELLITSELFSHETURNSTOFAVOURANDTOPRETTINESS'
			}

		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'http://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-u_v26_en.html'],
			model: 'I',
			setup: {
				rotors: ['III', 'I', 'II'],
				plugs: 'EJ ZX TU KV MI DB NW GQ LR FO',
				ringSettings: [4, 5, 7],
				reflector: 'B'
			},
			message: {
				start: 'OEC',
				encoded: 'WCOJLTOXJZSYRDRGPLWJJOXWFCCISIRBMEHOKYWDFNJFWXCWATBJJTJLTMEQMWBIFXVIBJJOPAYKSUZIFATKZLMMVHNIYOPHBYKBAAHCYPKELSEWGKBHAHROMIGPBRYQXFCRJGUXWHFKBGTECDZDZLWVIHXKOFBXWJKETDLBLWKDTPPFUFKPKMROJHZMDDBHTKXSWMPNRYOVWEEUIMKYBGVSQJCFNBKKLVYZGKQQRTMMPTWJAMJQPGDCGHLUNQKSVWOAALTXS',
				decoded: 'HOWDANGEROUSISITTHATTHISMANGOESLOOSEYETMUSTNOTWEPUTTHESTRONGLAWONHIMHESLOVEDOFTHEDISTRACTEDMULTITUDEWHOLIKENOTINTHEIRJUDGMENTBUTTHEIREYESANDWHERETISSOTHEOFFENDERSSCOURGEISWEIGHDBUTNEVERTHEOFFENCEAMINOTITHERIGHTOLDJEPHTHAHAHMYGOODLORDWHATHAVEISEENTONIGHTWHATGERTRUDE'
			}

		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'http://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-u_v26_en.html'],
			model: 'M3',
			setup: {
				rotors: ['IV', 'VII', 'I'],
				plugs: 'NI RM AH VQ UL FD GS WY JE TX',
				ringSettings: [23, 13, 3],
				reflector: 'B'
			},
			message: {
				start: 'HMP',
				encoded: 'PDWBCHJGYPCHHUXNDVUGEZSYIUATENCFMYUIQPWIBBIELWXUNAWZNPVNKTBOJTHEDWDJJKQEOEPSMJBRGTWJGNURUXXEFYGJKUSHYPFZIDEWODCRKXFFLQKVLRLXNIACDAZEIFJXTLZXUSJRLQIDBJTIDUAFRJAYTSNFBJBXKVLASUZQMPCJJLCOZDMDIRPEJANYQCIUPLAPSMQMXXXHSMMNEDCSDDILZOWGPXVWKWKHKYLXEOYFHMNBPURLKA',
				decoded: 'COMEHITHERGENTLEMENANDLAYYOURHANDSAGAINUPONMYSWORDNEVERTOSPEAKOFTHISTHATYOUHAVEHEARDSWEARBYMYSWORDAREYOUFAIRNOMOREBEDONEWESHOULDPROFANETHESERVICEOFTHEDEADTOSINGAREQUIEMANDSUCHRESTTOHERASTOPEACEPARTEDSOULSNIGGARDOFQUESTIONBUTOFOURDEMANDSMOSTFREEINHISREPLY'
			}
		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'http://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-u_v26_en.html'],
			model: 'M3',
			setup: {
				rotors: ['VI', 'IV', 'II'],
				plugs: 'QZ DK LA MX ET BG VO SH YP WJ',
				ringSettings: [4, 15, 21],
				reflector: 'B'
			},
			message: {
				key: 'ASA',
				encoded: 'URVTSTZATDUFQLGIUJKVRRVJZHSHDOGEKHREOYECTDTBUYZACWNGMHTUGWNUIUJMKHQQAPAKQIQYDHXWBRILLAURPOYTGNYUDANCLJCKSIPCJWLCLBHVXKNNRXPHHJUQJMRBZZASHQLCLQMMTYOA',
				decoded: 'EXCHANGEFORGIVENESSWITHMENOBLEHAMLETMINEANDMYFATHERSDEATHCOMENOTUPONTHEENORTHINEONMEHORATIOIAMDEADTHOULIVESTREPORTMEANDMYCAUSEARIGHTTOTHEUNSATISFIED'
			}
		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'http://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-u_v26_en.html'],
			model: 'M3',
			setup: {
				rotors: ['II', 'I', 'VII'],
				plugs: 'BL SK WD FN HZ IX QU EJ PC OM',
				ringSettings: [19, 20, 14],
				reflector: 'B'
			},
			message: {
				key: 'HRO',
				encoded: 'LJVBCURJWLPLFSYKZNBEXTUHTPCWRQTOKBRBCDMAMQCDMIXIOMVCVKBVDXMXIJVELDNRBXPWCCICPEHAXTVZYV',
				decoded: 'WHYONEFAIRDAUGHTERANDNOMORETHEWHICHHELOVEDPASSINGWELLYOUTOLDUSOFSOMESUITWHATISTLAERTES'
			}
		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'https://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-m4_v16_en.html'],
			model: 'M4',
			setup: {
				rotors: ['Beta', 'II', 'VII', 'V'],
				plugs: 'YL SF VO AI BX WC KD MT JN PH',
				ringSettings: [9, 18, 12, 8],
				reflector: 'Thin-B'
			},
			message: {
				key: 'MKDM',
				encoded: 'KEKZCUAFFTWOHZURZPCTWWCICFOGAXBTCTPHMAIFXEEBAYFCQOOAGFKWAHOFEUYWBUEZIWADYATCTLEOUGRPSQDTBZCHIGQGBCXBRYDSGFDBEURKHUKFUYHALYROROKIZWFTPEJJUIRGBIQFGPLGWXJPMNPSEHYSGITZCGSMZXVVJCRXZQWGMOKNBTYVRMYHPWMEXGPUSHYQEWIDZTITRUFXLPYAQUCZVDCAVCMWGGQMXEQDFPTBLOJDEGTGKXXWFIGASTKMLWHFOPPXNBVDYUHDNOJNATOTMWLJGLSTJXDDHGKOBZCPNTPLPKINICEWVJUUNVKDYWGVFFJE',
				decoded: 'YOUNGFORTINBRASWITHCONQUESTCOMEFROMPOLANDTOTHEAMBASSADORSOFENGLANDGIVESTHISWARLIKEVOLLEYNOUPSWORDANDKNOWTHOUAMOREHORRIDHENTWHENHEISDRUNKASLEEPORINHISRAGEORINTHEINCESTUOUSPLEASUREOFHISBEDATGAMINGSWEARINGORABOUTSOMEACTTHATHASNORELISHOFSALVATIONINTTHENTRIPHIMTHATHISHEELSMAYKICKATHEAVENANDTHATHISSOULMAYBEASDAMNDANDBLACKASHELLWHERETOITGOES'
			}
		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'https://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-m4_v16_en.html'],
			model: 'M4',
			setup: {
				rotors: ['Gamma', 'VIII', 'VI', 'V'],
				plugs: 'RX VA HE ST QL UK PG DB JZ OC',
				ringSettings: [7, 14, 19, 26],
				reflector: 'Thin-C'
			},
			message: {
				key: 'IBFP',
				encoded: 'PUEDVIRAVXYTNFBCUGMSVLVZYRREYMERJCSCKSCACKBZNZNNLYFAAUIKFRMIIUPWBFSFWVKRYLMKHXKXGJXRFQJNRSLSFGFBBKEVQPWCLKUBMNUUKWIYSUQXAXOGZKSBVCRXMIMNJKOXCUBFXSGYQVUXSAWOFQVDQIYTULXKZXEKCQGXQXFVADTSSVZZGQMHBBMJQBYLUWAJELOIYICWTDZQAQYPBCAGKHTICILGFKMNRRXGRUTADCIOCQBXHODIRWXARKENICHVMVHWRRIVWWDCG',
				decoded: 'IFYOUDOMEETHORATIOANDMARCELLUSTHERIVALSOFMYWATCHBIDTHEMMAKEHASTETHEGREATMANDOWNYOUMARKHISFAVOURITEFLIESTHEPOORADVANCEDMAKESFRIENDSOFENEMIESOWONDERFULGOODMYLORDTELLITFORGIVEMETHISMYVIRTUEFORINTHEFATNESSOFTHESEPURSYTIMESVIRTUEITSELFOFVICEMUSTPARDONBEGYEACURBANDWOOFORLEAVETODOHIMGOOD'
			}
		},
		{
			verified: ['https://cryptii.com/pipes/enigma-machine', 'https://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-m4_v16_en.html'],
			model: 'M4',
			setup: {
				rotors: ['Gamma', 'II', 'VIII', 'VII'],
				plugs: 'SA LM XY CV ER GB KT PJ WH DU',
				ringSettings: [25, 21, 11, 2],
				reflector: 'Thin-B'
			},
			message: {
				key: 'TQXV',
				encoded: 'NWWKWEOXQKVGAFEMANRTAEGIZIROXKLPEFTWZJEHQVXDIDDXYIDASSXZJUSZTDHEUKPUVNTOONBYOZJAGCMTEFYHCSJCHOHGMXWHLZAVCBRVNGAMTFUNZNVWPAWBXUICZCYKDBSKJZBQPOMBJCJVKSIGJXAXBDZLYAGPSVATCLXXEQVIWUKBOP',
				decoded: 'COMEHITHERGENTLEMENANDLAYYOURHANDSAGAINUPONMYSWORDNEVERTOSPEAKOFTHISTHATYOUHAVEHEARDSWEARBYMYSWORDSEEITSTALKSAWAYSTAYSPEAKSPEAKICHARGETHEESPEAKTISGONEANDWILLNOTANSWERISHALLOBEYMYLORD'
			}
		}
	]
}