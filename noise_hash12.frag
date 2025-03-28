#define ITERATIONS 1
float hashOld12(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 position = fragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
	float a = 0.0, b = 0.0;
    for (int t = 0; t < ITERATIONS; t++) {
        float v = float(t+1)*.152;
        vec2 pos = (position * v + iTime * 1500. + 50.0);
        a += hash12(pos.xy);
    }
    fragColor = vec4(a, a, a, 1.0);
}
