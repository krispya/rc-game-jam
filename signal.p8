pico-8 cartridge // http://www.pico-8.com
version 42
__lua__

px = 64
py = 80
l_px = 64
l_py = 80
perm = {}


function _init()
    cls()
    srand(stat(95))
    for i=0, 127 do
        add(perm, i)
    end
    shuffle(perm)
    for i=0, 127 do
        add(perm, perm[i + 1])
    end
end

function _update60()
    cache_x = px
    cache_y = py
    px += (px - l_px) * 0.9
    py += (py - l_py)
    l_px = cache_x
    l_py = cache_y
    if btn(0) then
        px -= .1
    end
    if btn(1) then
        px += .1
    end
    if btnp(4) then
        py -= 2
    end
    if py <= 80 then
        py += .1
    else
        l_py = 80
        py = 80
    end
end

l_border = 12
r_border = 102
t_border = 12
b_border = 102

function _draw()
    cls()
    if px > 20 and px < 102 then
        spr(13, px, py)
    end
    spr(1, 18, 12, 12, 12)
    local off = time() * 100
    for xi = 1, 48 do
        for yi = 1, 48 do
            -- printh(noise(.85, 10.75))
            pset(xi, yi, flr(noise(xi / 128.0, yi / 128.0)))
        end
    end
end

function noise(x, y)
    local x_perm = flr(x) % 128 + 1
    local y_perm = flr(y) % 128 + 1
    local x_fract = x - flr(x)
    local y_fract = y - flr(y)
    local tr = {x_fract - 1, y_fract - 1}
    local tl = {x_fract, y_fract - 1}
    local br = {x_fract - 1, y_fract}
    local bl = {x_fract, y_fract}
    local first = x_perm + 1
    local second = perm[first] + y_perm + 1
    local p_tr = perm[perm[x_perm + 1] + y_perm + 1]
    local p_tl = perm[perm[x_perm] + y_perm + 1]
    local p_br = perm[perm[x_perm + 1] + y_perm]
    local p_bl = perm[perm[x_perm] + y_perm]
    local const_tr = const_vector(p_tr)
    local const_tl = const_vector(p_tl)
    local const_br = const_vector(p_br)
    local const_bl = const_vector(p_bl)
    local dot_tr = dot(tr[1], tr[2], const_tr[1], const_tr[2])
    local dot_tl = dot(tl[1], tl[2], const_tl[1], const_tl[2])
    local dot_br = dot(br[1], br[2], const_br[1], const_br[2])
    local dot_bl = dot(bl[1], bl[2], const_bl[1], const_bl[2])
    local u = fade(x_fract)
    local v = fade(y_fract)
    return lerp(u, lerp(v, dot_bl, dot_tl), lerp(v, dot_br, dot_tr))
end

function fade(t)
	return ((6*t - 15)*t + 10)*t*t*t;
end

function lerp(t, a1, a2)
	return a1 + t*(a2-a1);
end

function const_vector(p)
    local h = p % 4
    if h == 0 then
        return {1., 1.}
    elseif h == 1 then
        return {-1., 1.}
    elseif h == 2 then
        return {-1., -1.}
    else
        return {1., -1.}
    end
end

function dot(x0, y0, x1, y1)
    return x0 * x1 + y0 * y1
end

function shuffle(tbl)
    for i=1, #tbl do
        local rnd_i = flr(rnd(#tbl)) + 1
        local temp = tbl[i]
        tbl[i] = tbl[rnd_i] 
        tbl[rnd_i] = temp
    end
end


__gfx__
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000
00000000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000828000000000000000000000
00700700055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000020000000000000000000000
00077000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000808000000000000000000000
00077000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
00700700055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555000000000000000000000000000000000000000000000000000000000000000000000000000000555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbb3bbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbb3bbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3bbbbbbbbbbbbbbbbbbb3bbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbb3bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb555550000000000000000000000000000000
00000000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
00000000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
00000000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
00000000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
00000000055555555555555555555555555555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000
