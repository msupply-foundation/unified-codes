use std::convert::TryInto;

pub fn i32_to_u32(num: i32) -> u32 {
    num.try_into().unwrap_or(0)
}

pub fn i64_to_u32(num: i64) -> u32 {
    num.try_into().unwrap_or(0)
}

pub fn usize_to_u32(num: usize) -> u32 {
    num.try_into().unwrap_or(0)
}

pub fn u32_to_i32(num: u32) -> i32 {
    num.try_into().unwrap_or(0)
}
