# Architecture decisions

- Flash sale page is integrated with API to fetch real flashsale vouchers and products
- Fetches flashsale vouchers with `type=flashsale` parameter from `/vouchers` endpoint
- Filters active vouchers where `valid_end > today`
- For each voucher section, fetches products with `is_flashsale=true` and `voucher_id` parameters
- Countdown timer is based on `flashsale_time_start` and `flashsale_time_end` fields from voucher data
- Shows "Mulai dalam [time]" if not started, countdown if active, and "Berakhir" if ended